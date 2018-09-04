import { FolderNode } from "./FolderNode";
import { TempFileNode } from "./FileNode";
export class FileSystem extends FolderNode {
    constructor(rootNode) {
        super({}, rootNode || { name: '根目录' });
        this.isRoot = true;
        this.fileSystem = this;
    }
    findParentNode(node) {
        let result = undefined;
        this.forEach((_node, parentNode) => {
            if (_node.id === node.id) {
                result = this.loadNode(parentNode);
                return false;
            }
        });
        return result;
    }
    deleteNodeById(id) {
        this.forEach((node, parentNode, i) => {
            if (node.id === id) {
                parentNode.sub.splice(i, 1);
                return false;
            }
        });
    }
    findNodeById(id) {
        typeof id === "string" && (id = Number.parseFloat(id));
        let result = undefined;
        this.forEach((node) => {
            if (node.id === id) {
                result = this.loadNode(node);
                return false;
            }
        });
        return result;
    }
    replaceNode(newNode) {
        const id = newNode.id;
        this.forEach((node, parentNode, i) => {
            if (node.id === id) {
                parentNode.sub[i] = newNode;
                return false;
            }
        });
    }
    loadNode(node) {
        if (node.constructor !== Object) {
            return node;
        }
        else if (node.sub) {
            const newNode = new FolderNode(this, node);
            this.replaceNode(newNode);
            return newNode;
        }
        else {
            return new TempFileNode(this, node.id);
        }
    }
}
