import {SimpleEvent} from "./SimpleEvent"
import {UploadTempNode} from './file-system/mixins/CouldUploadNode'
import {FileNode} from "./file-system/FileNode"
import {FolderNode} from "./file-system/FolderNode";

export enum UploadEvents {
    Initializing = 'Initializing',
    VirtualNodeGenerated = 'VirtualNodeGenerated',
    VirtualNodeRemoving = 'VirtualNodeRemoving',
    PercentUpdating = 'PercentUpdating',
    RateUpdating = 'RateUpdating',
    UploadPaused = 'UploadPaused',
    RelNodeGenerated = 'RelNodeGenerated',
    Success = 'Success',
    Fail = 'Fail'
}

export enum RollbackSteps {
    Hashing = 'Hashing',
    Uploading = 'Uploading'
}

declare class Upload {
    event: SimpleEvent;
    percent: number;
    rate: string;
    animationDuration: number;
    step: UploadEvents;
    rollbackStep?: RollbackSteps;
    node?: UploadTempNode | FileNode;
    areWeUseQuickUpload: boolean;
    shouldWeShowUploadPercent: boolean;
    isCanceled: boolean;
    isPaused: boolean;
    rejectWillResolve: Function;
    _cancel: object;
    _pause: object;

    upload(file: any, toFolder: FolderNode): Promise<void>;

    cancelUpload(): Promise<void>;

    pauseOrStartUpload(shouldPause: boolean): Promise<void>;

    on(eventNames: string, callback: Function): number;

    unbind(eventNames: string, index: number): void;
}

export default Upload
