const {fromEvent} = require('rxjs');

const Process = require('./Process')

const nextVirtualWebSocketId = 0
module.exports = class VirtualWebSocket extends Process {
    constructor(ws) {
        super(async () => {
            this._ws = ws;

            this._id = nextVirtualWebSocketId++
            
            this._observable = fromEvent(ws, "message")
            this._subscription = this._observable.subscribe(this._handleMessage)

            await this.promiseTo('close')
            this._subscription.unsubscribe()
            ws.close()
        })
    }

    _handleMessage(rawMsg) {
        const msg = JSONparseSafe(rawMsg)
        if (msg.vwsid === this._id) this.emit('message', )
    }
}
