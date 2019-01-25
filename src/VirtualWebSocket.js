const fromEvent from 'rxjs';

const Process = require('./Process')

module.exports = class VirtualWebSocket extends Process {
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