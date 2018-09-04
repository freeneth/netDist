import {FileType, Node} from "./Node"
import {applyMix} from "../../util/mix"
import {CouldUploadNode} from "./mixins/CouldUploadNode"
import {CouldRemoveNode} from "./mixins/CouldRemoveNode"
import {CouldCreateNode} from "./mixins/CouldCreateNode"
import {CouldMoveOrCopyNode} from "./mixins/CouldMoveOrCopyNode"
import {FileSystem} from "./FileSystem";
import {
    HasPercentNode,
} from "./mixins/HasPercentNode";

export interface PlainFileNode {
    fileId: string;
    name: string;
    size: string;
    sizeNumber: number;
    type: FileType;
    hash?: string;
    id: number;
    updateTime?: string;
    updateUserName?: string
}

export class TempFileNode {
    fileSystem: FileSystem;

    id: number;
    _isTempFile: true;

    constructor(fileSystem, id) {
        this.fileSystem = fileSystem;
        this.id = id;
        this._isTempFile = true
    }

    toFileNode(nodeProps) {
        return new FileNode(this.fileSystem, {
            ...nodeProps,
            id: this.id
        })
    }
}

export interface FileNode extends Node, CouldUploadNode, CouldRemoveNode,
    CouldCreateNode, CouldMoveOrCopyNode, HasPercentNode {
}
Promise.resolve().then(() => {
    applyMix(FileNode, [CouldUploadNode, CouldRemoveNode,
        CouldCreateNode, CouldMoveOrCopyNode, HasPercentNode])
});
export class FileNode extends Node {
    
    fileId: string;
    name: string;
    sizeNumber: number;
    size: string;
    type: FileType;
    hash?: string;
    _isFile: true;
    updateTime?: string;
    updateUserName?: string;

    constructor(fileSystem, {
        fileId, name, size, sizeNumber, type, hash, id,
        updateTime, updateUserName
    }: PlainFileNode) {
        super(fileSystem);
        this.fileId = fileId;
        this.name = name;
        this.sizeNumber = sizeNumber;
        this.size = size;
        this.type = type;
        this.updateTime = updateTime;
        this.updateUserName = updateUserName;
        this._isFile = true;
        id && (this.id = id);
        hash && (this.hash = hash);
        this.onNodeLoaded();
    }

    get _type() {
        return this.type
    }

    set _type(val) {
        this.type = val
    }

    copy(): FileNode {
        return new FileNode(this.fileSystem, Object.assign({}, this,
            {id: undefined}))
    }
}
