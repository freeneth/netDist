export enum FileUploadPercentState {
    Success,
    Error,
    Processing
}

export class HasPercentNode {
  private _percent: number;
  private _duration: number;
  private _state: FileUploadPercentState;
  private _onTransforming: boolean;

  get percent () {
    return this._percent
  }
  get duration () {
    return this._duration
  }
  get state () {
    return this._state
  }
  get onTransforming () {
    return this._onTransforming
  }

  start(): HasPercentNode {
    this._onTransforming = true;
    this._state = FileUploadPercentState.Processing;
    this._percent = 0;
    this._duration = 400;
    return this
  }
  updatePercent({percent, duration}: {percent: number, duration: number})
      : HasPercentNode {
    this._percent = percent;
    this._duration = duration;
    return this
  }
  success(): void {
    this._duration = 200;
    this._percent = 100;
    this._state = FileUploadPercentState.Success;
    this.end();
  }
  fail(): void {
    this._duration = 200;
    this._percent = 100;
    this._state = FileUploadPercentState.Error;
    this.end()
  }
  end(): void {
    this._onTransforming = false
  }
}
