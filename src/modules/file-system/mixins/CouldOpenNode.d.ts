import {Node} from "../Node";

export declare class CouldOpenNode {
    open (callback: ((node: Node) => void)): Promise<void>
}
