import api from "../../../api/index";
import { FolderNode } from "../FolderNode";
import { FileNode } from "../FileNode";
/**
 * @property _worker {toFolder: FolderNode}
 * @property fileSystem FileSystem
 */
export class CouldCreateNode {
    /**
     * 新建文件夹
     */
    async create(toFolder) {
        if (this instanceof FolderNode) {
            return await this.createFolder(toFolder);
        }
        else if (this instanceof FileNode) {
            return await this.createFile(toFolder);
        }
        else {
            throw new Error('该节点类型未知，无法修改该节点');
        }
    }
    async createFolder(toFolder) {
        if (!(this instanceof FolderNode)) {
            throw new Error();
        }
        const node = this;
        await toFolder.append(node, false);
        this.applyToServer = async () => {
            await api.patchFileSys(node.fileSystem);
            return this;
        };
        return this;
    }
    /**
     * 创建文件 或 脑图，文档
     * {fileName, fileId, fileSize, fileType, fileHash}
     */
    async createFile(toFolder) {
        if (!(this instanceof FileNode)) {
            throw new Error();
        }
        const node = this;
        // 保存到 FileInfo
        await api.postFileInfo(node);
        // 追加到 FileSystem
        try {
            await toFolder.append(this, false);
        }
        catch (e) {
            await api.deleteFileInfo(node.id);
            throw e;
        }
        this.applyToServer = async () => {
            await api.patchFileSys(node.fileSystem);
            return this;
        };
        return this;
    }
}
