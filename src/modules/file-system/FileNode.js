import { Node } from "./Node";
import { applyMix } from "../../util/mix";
import { CouldUploadNode } from "./mixins/CouldUploadNode";
import { CouldRemoveNode } from "./mixins/CouldRemoveNode";
import { CouldCreateNode } from "./mixins/CouldCreateNode";
import { CouldMoveOrCopyNode } from "./mixins/CouldMoveOrCopyNode";
import { HasPercentNode, } from "./mixins/HasPercentNode";
export class TempFileNode {
    constructor(fileSystem, id) {
        this.fileSystem = fileSystem;
        this.id = id;
        this._isTempFile = true;
    }
    toFileNode(nodeProps) {
        return new FileNode(this.fileSystem, Object.assign({}, nodeProps, { id: this.id }));
    }
}
Promise.resolve().then(() => {
    applyMix(FileNode, [CouldUploadNode, CouldRemoveNode,
        CouldCreateNode, CouldMoveOrCopyNode, HasPercentNode]);
});
export class FileNode extends Node {
    constructor(fileSystem, { fileId, name, size, sizeNumber, type, hash, id, updateTime, updateUserName }) {
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
        return this.type;
    }
    set _type(val) {
        this.type = val;
    }
    copy() {
        return new FileNode(this.fileSystem, Object.assign({}, this, { id: undefined }));
    }
}
