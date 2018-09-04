export var FileUploadPercentState;
(function (FileUploadPercentState) {
    FileUploadPercentState[FileUploadPercentState["Success"] = 0] = "Success";
    FileUploadPercentState[FileUploadPercentState["Error"] = 1] = "Error";
    FileUploadPercentState[FileUploadPercentState["Processing"] = 2] = "Processing";
})(FileUploadPercentState || (FileUploadPercentState = {}));
export class HasPercentNode {
    get percent() {
        return this._percent;
    }
    get duration() {
        return this._duration;
    }
    get state() {
        return this._state;
    }
    get onTransforming() {
        return this._onTransforming;
    }
    start() {
        this._onTransforming = true;
        this._state = FileUploadPercentState.Processing;
        this._percent = 0;
        this._duration = 400;
        return this;
    }
    updatePercent({ percent, duration }) {
        this._percent = percent;
        this._duration = duration;
        return this;
    }
    success() {
        this._duration = 200;
        this._percent = 100;
        this._state = FileUploadPercentState.Success;
        this.end();
    }
    fail() {
        this._duration = 200;
        this._percent = 100;
        this._state = FileUploadPercentState.Error;
        this.end();
    }
    end() {
        this._onTransforming = false;
    }
}
