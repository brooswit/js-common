import { fromEvent } from 'rxjs';

module.exports = class VirtualWebSocket extends process {
    constructor(ws, parent) {
        super(async ()=>{
            this._ws = ws;
            this._observable = fromEvent(ws, "message")
            this._subscription = this._observable.subscribe(() => {

            })
            await this.promiseToClose
        })
    }
}