import { fromEvent } from 'rxjs';

module.exports = class VirtualWebSocket extends process {
    constructor(ws, optionalParentProcess) {
        super(optionalParentProcess)
        this._ws = ws;
        this._observable = fromEvent(ws, "message")
        this._subscription = this._observable.subscribe(() => {

        })
    }
}