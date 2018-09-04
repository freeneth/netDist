import {errorAndTip} from "../../../util/reject-tip"
import api from "../../../api/index"
import {current} from "../../current"
import {FileNode} from "../FileNode";
import {FolderNode} from "../FolderNode";

export class CouldMoveOrCopyNode {

    async moveOrCopy(toFolder: FolderNode, isMove: boolean): Promise<FileNode> {
        if (!(this instanceof FileNode)) {
            throw new Error('非文件节点无法复制')
        }
        if (isMove && toFolder === current.folder) {
            throw errorAndTip('文件没有移动')
        }
        if (isMove && toFolder.id === this.id) {
            throw errorAndTip(`无法完成移动：从 ${this.name} 到 ${toFolder.name}`)
        }

        let node: FileNode = this;

        if (!isMove) {
            node = node.copy()
        }

        // this.node = node

        // 添加新节点
        await toFolder.append(this, !isMove);

        // 复制操作，保存新的文件信息
        if (!isMove) {
            await api.postFileInfo(node)
        }

        // 移除当前节点
        if (isMove) {
            const currentIndex = current.folder.sub
                .findIndex(it => it.id === node.id);
            current.folder.sub.splice(currentIndex, 1)
        }
        // 保存
        await api.patchFileSys(this.fileSystem);

        if (!isMove) {
            await api.increaseReferenceCount(node.fileId)
        }

        return node
    }

}
