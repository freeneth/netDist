import {FolderNode, PlainFolderNode} from "./FolderNode"
import {TempFileNode} from "./FileNode"
import {Node} from "./Node";

export class FileSystem extends FolderNode {
    isRoot: boolean;
    fileSystem: FileSystem;

    constructor(rootNode?: PlainFolderNode) {
        super(<FileSystem>{}, rootNode || {name: '根目录'});
        this.isRoot = true;
        this.fileSystem = this
    }

    findParentNode(node: Node): FolderNode {
        let result = undefined;
        this.forEach((_node, parentNode) => {
            if (_node.id === node.id) {
                result = this.loadNode(parentNode);
                return false
            }
        });
        return result
    }

    deleteNodeById(id: number): void {
        this.forEach((node, parentNode, i) => {
            if (node.id === id) {
                parentNode.sub.splice(i, 1);
                return false;
            }
        })
    }

    findNodeById(id: number|string): Node {
        typeof id === "string" && (id = Number.parseFloat(id));
        let result = undefined;
        this.forEach((node) => {
            if (node.id === id) {
                result = this.loadNode(node);
                return false
            }
        });
        return result
    }

    replaceNode(newNode: Node): void {
        const id = newNode.id;
        this.forEach((node, parentNode, i) => {
            if (node.id === id) {
                parentNode.sub[i] = newNode;
                return false
            }
        })
    }

    loadNode(node: any): FolderNode | TempFileNode {
        if (node.constructor !== Object) {
            return node
        } else if (node.sub) {
            const newNode = new FolderNode(this, node);
            this.replaceNode(newNode);
            return newNode
        } else {
            return new TempFileNode(this, node.id)
        }
    }
}
