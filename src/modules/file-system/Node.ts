import {fromPairs} from "../../util/utils"
import {FileSystem} from "./FileSystem";
import {FolderNode} from "./FolderNode"

export enum FileType {
    Image   = 'image',
    Video   = 'video',
    Text    = 'text',
    Audio   = 'audio',
    Excel   = 'excel',
    Pdf     = 'pdf',
    Ppt     = 'ppt',
    Word    = 'word',
    Zip     = 'zip',
    File    = 'file',
    Mind    = 'mind',
    Doc     = 'doc',
    Folder  = 'folder',
    Virtual = 'virtual'
}

export const FileTypeFileExtensionMap = {
    [FileType.Image]: ['jpg', 'png', 'bmp', 'svg', 'gif'],
    [FileType.Video]: [
        'mp4', 'avi', 'flv', 'mov', 'rmvb', 'rm', 'mkv', 'mpg', 'mpeg', 'm4v',
        'mkv', 'webm'
    ],
    [FileType.Text]: [
        'txt', 'js', 'go', 'c', 'java', 'html', 'css', 'jsx', 'ts', 'md',
        'json', 'scss', 'cpp', 'json', 'cc', 'cpp'
    ],
    [FileType.Audio]: ['mp3', 'wma', 'wav', 'ogg', 'flac'],
    [FileType.Excel]: ['xls', 'xlsx'],
    [FileType.Pdf]: ['pdf'],
    [FileType.Ppt]: ['ppt', 'pptx'],
    [FileType.Word]: ['doc', 'docx'],
    [FileType.Zip]: ['zip', '7z', 'rar', 'gz', 'tar'],
};

export const RelFileTypes: Array<FileType> = [FileType.Image, FileType.Video,
    FileType.Text, FileType.Audio, FileType.Excel, FileType.Pdf, FileType.Ppt,
    FileType.Word, FileType.Zip, FileType.File];

/**
 * 所有文件节点的父类
 */
export class Node {
    fileSystem: FileSystem;

    id: number;
    type: FileType;
    _loaded: boolean;
    _isFolder: boolean;
    _isRelFile: boolean;
    _parentNode: () => FolderNode;

    constructor (fileSystem: FileSystem, node?: object) {
        if (!fileSystem) {
            throw new Error('param of fileSystem is required.')
        }
        this.fileSystem = fileSystem;
        if (node) {
            Object.assign(this, node);
            this.onNodeLoaded()
        } else {
            this.id = Node.newId()
        }
    }

    onNodeLoaded(): void {
        if (this._loaded) {
            return
        }
        this._loaded = true;
        this._isFolder = !!this['sub'];
        this._isRelFile = RelFileTypes.includes(this.type);
        this._parentNode = () => this.fileSystem.findParentNode(this);
    }

    toJSON () {
        let entries = Object.entries(this);
        entries = entries.filter(([key, value]) => {
            if (typeof value === 'function') {
                return false
            }
            if (typeof key !== 'string' || key.startsWith('_')) {
                return false
            }
            return !['fileSystem'].includes(key)
        });
        return fromPairs(entries)
    }

    static newId(): number {
        return Math.random()
    }
}
