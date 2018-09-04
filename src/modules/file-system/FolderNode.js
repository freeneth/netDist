import api from "../../api/index";
import { FileType, Node } from "./Node";
import { applyMix } from "../../util/mix";
import { isArray } from "../../util/object-utils";
import { errorAndTip } from "../../util/reject-tip";
import { CouldOpenNode } from "./mixins/CouldOpenNode";
import { CouldCreateNode } from "./mixins/CouldCreateNode";
import { CouldRemoveNode } from "./mixins/CouldRemoveNode";
import { groupBy } from "../../util/utils";
import { FileNode, TempFileNode } from "./FileNode";
import { CouldMoveOrCopyNode } from "./mixins/CouldMoveOrCopyNode";
import { HasPercentNode } from "./mixins/HasPercentNode";
Promise.resolve().then(() => {
    applyMix(FolderNode, [CouldOpenNode,
        CouldRemoveNode, CouldCreateNode, CouldMoveOrCopyNode, HasPercentNode]);
});
export class FolderNode extends Node {
    constructor(fileSystem, { id, name, sub }) {
        super(fileSystem);
        this.name = name;
        this.sub = sub || [];
        this._isSubLoaded = false;
        this._isSubInitialized = false;
        this._isFolder = true;
        this._type = FileType.Folder;
        id && (this.id = id);
        this.onNodeLoaded();
    }
    /**
     * 遍历当前节点下的所有内容（包括子文件夹）
     * @param callback (currentNode, parentNode, indexInFolder) => boolean
     */
    forEach(callback) {
        let endTraversal = false;
        const node = this;
        function deepTraversal(node) {
            const sub = node.sub;
            if (!sub || endTraversal) {
                return;
            }
            const length = sub.length;
            for (let i = 0; i < length; i++) {
                if (callback(sub[i], node, i) === false) {
                    endTraversal = true;
                    return;
                }
                deepTraversal(sub[i]);
            }
        }
        if (isArray(node)) {
            deepTraversal({ sub: node });
        }
        else if (callback(node) !== false) {
            deepTraversal(node);
        }
    }
    /**
     * 初始化文件夹内的文件节点
     */
    initSub() {
        const { sub, _isSubInitialized } = this;
        if (_isSubInitialized) {
            return;
        }
        this.sub = sub.map(n => this.fileSystem.loadNode(n));
        this._isSubInitialized = true;
    }
    /**
     * 加载文件夹内的文件节点
     * @returns {Promise<void>}
     */
    async loadSub() {
        const { sub, _isSubLoaded } = this;
        if (_isSubLoaded) {
            return this.sub;
        }
        // 分离文件夹和文件
        const { true: files, undefined: folders = [] } = groupBy(sub, node => node._isTempFile);
        if (files) {
            // 拉取文件并显示
            const fileProps = await api.getFileInfos(files.map(({ id }) => id));
            this.sub = folders.concat(fileProps.map(fps => {
                const index = sub.findIndex(({ id }) => id === fps.id);
                return sub[index].toFileNode(fps);
            }));
        }
        this._isSubLoaded = true;
        return this.sub;
    }
    /**
     * 查找当前文件夹下是否已存在该文件名
     * @param _name 文件名
     * @returns {Promise<boolean>}
     */
    async isNameExist(_name) {
        const sub = await this.loadSub();
        return sub.find((node) => node['name'] === _name);
    }
    /**
     * 往该文件夹内添加文件
     * @param node 文件节点
     * @param shouldRename 是否需要自动重命名（当存在相同文件名时）
     * @returns {Promise<void>}
     */
    async append(node, shouldRename = true) {
        const sub = this.sub;
        let suffix = node.name.split('.').pop();
        // 处理重复文件
        const renameExistFile = async () => {
            if (await this.isNameExist(node.name)) {
                if (!shouldRename) {
                    throw errorAndTip('文件名重复');
                }
                const tA = node.name.split('.');
                tA.pop();
                node.name = `${tA.join('.')}-副本.${suffix}`;
                await renameExistFile();
            }
        };
        await renameExistFile();
        if (node instanceof FolderNode) {
            const index = sub.findIndex(n => n instanceof FileNode || n instanceof TempFileNode);
            sub.splice(index, 0, node);
        }
        else {
            sub.push(node);
        }
    }
    toJSON() {
        const copiedNode = super.toJSON();
        copiedNode.sub = [];
        this.sub.forEach((node) => {
            if (node instanceof FolderNode) {
                copiedNode.sub.push(node.toJSON());
                return;
            }
            if (node instanceof FileNode) {
                copiedNode.sub.push({ id: node.id });
                return;
            }
            if (node.constructor === Object) {
                // 未处理的数据，原样保存即可
                copiedNode.sub.push(node);
            }
        });
        return copiedNode;
    }
}
