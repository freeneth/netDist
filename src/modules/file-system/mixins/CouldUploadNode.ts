import api from "../../../api/index"
import {FileType, FileTypeFileExtensionMap} from "../Node"
import {FileNode} from "../FileNode"
import {FileSystem} from "../FileSystem";
import {FolderNode} from "../FolderNode";

const units = ['B', 'K', 'M', 'G'];
const getSize = (_size, unitIndex) => {
    if (_size > 100) {
        return getSize(_size / 1024, unitIndex + 1)
    }
    const fixedSize = _size > 10 ? (_size | 0) : _size.toFixed(1);
    return fixedSize + units[unitIndex]
};

const generateFileType = (() => {
    const eme = Object.entries(FileTypeFileExtensionMap);

    return (fileName) => {
        let fileType = FileType.File;
        const extension = fileName.split('.').pop();
        for (let e of eme) {
            const [key, value] = e;
            if (value.includes(extension)) {
                fileType = <FileType>key;
                break
            }
        }
        return fileType
    }
})();

export class UploadTempNode {
    fileSystem: FileSystem;
    tempNode: any;
    toFolder: FolderNode;
    node?: FileNode;

    constructor(tempNode, toFolder) {
        Object.assign(this, tempNode);
        this.fileSystem = toFolder.fileSystem;
        this.tempNode = tempNode;
        this.toFolder = toFolder;
        this.node = undefined
    }

    toFileNode(fileId, hash) {
        return this.node = new FileNode(this.fileSystem,
            Object.assign({}, this.tempNode, {fileId, hash}))
    }

    increaseReferenceCount() {
        return this.node._isRelFile
            ? api.increaseReferenceCount(this.node.fileId)
            : Promise.resolve()
    }
}

export class CouldUploadNode {
    static upload(name, sizeNumber, toFolder) {
        const tempNode = {
            name,
            size: getSize(sizeNumber, 0),
            sizeNumber,
            type: generateFileType(name)
        };

        return new UploadTempNode(tempNode, toFolder)
    }
}
