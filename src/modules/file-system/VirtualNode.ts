import {applyMix} from "../../util/mix"
import {FileType, Node} from "./Node"
import {CouldOpenNode} from "./mixins/CouldOpenNode"
import {FolderNode} from "./FolderNode"

export interface VirtualNode extends Node, CouldOpenNode {
}
export class VirtualNode extends Node {
    _isVirtual: true;
    _relNode: FolderNode;
    _type: FileType.Virtual;
    name: string;

    constructor(linkNode: FolderNode | VirtualNode) {
        super(linkNode.fileSystem);
        this._isVirtual = true;
        this._type = FileType.Virtual;
        if (linkNode instanceof VirtualNode) {
            this._relNode = linkNode._relNode._parentNode();
            this.name = `返回上级 （${linkNode._relNode.name}）`
        } else {
            this._relNode = linkNode;
            this.name = `返回上级 （${linkNode.name}）`
        }
    }
}

Promise.resolve().then(() => {
    applyMix(VirtualNode, [CouldOpenNode]);
});
