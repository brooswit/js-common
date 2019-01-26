const {fromEvent} = require('rxjs');

const Process = require('./Process')

const nextVirtualWebSocketId = 0
module.exports = class VirtualWebSocket extends Process {
    constructor(ws) {
        super(async () => {
            this._id = nextVirtualWebSocketId++
            this._ws = ws;
            this._observable = fromEvent(ws, "message")
            this._subscription = this._observable.subscribe(this._handleMessage)

            await this.promiseTo('close')
            ws.close()
        })
    }

    _handleMessage(message) {
        const paylaod = JSONparseSafe(message)
        paylaod
    }
}
