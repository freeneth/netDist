import {FileSystem} from "./file-system/FileSystem";
import {FolderNode} from "./file-system/FolderNode";

export const current: {
    fileSystem?: FileSystem;
    folder?: FolderNode;
} = {
    fileSystem: undefined,
    folder: undefined
};

window['current'] = current;
