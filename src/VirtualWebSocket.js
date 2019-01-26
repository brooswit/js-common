const {fromEvent} = require('rxjs');

const Process = require('./Process')

const nextVirtualWebSocketChannel = 0
const nextPingId = 0

module.exports = class VirtualWebSocket extends Process {
    constructor(ws, channel) {
        super(async () => {
            this._ws = ws;

            this._channel = channel || nextVirtualWebSocketChannel++
            
            this._observable = fromEvent(ws, "message")
            this._subscription = this._observable.subscribe(this._handleMessage)

            await this.promiseTo('close')
            this.send('close')
            this._subscription.unsubscribe()
        })
    }

    ping() {
        const pingId = nextPingId ++
        this.send('ping', {pingId})
    }

    _handleMessage(rawMsg) {
        const msg = JSONparseSafe(rawMsg)
        const {channel, event, payload} = msg.event
        if (channel === this._channel) {
            if (event === 'close') {
                this.close()
            } else if (event === 'message') {
                this.emit('message', payload)
            } else if (event === 'ping') {
                this.send('pong', payload)
                this.emit('ping', payload)
            }
        }
    }
}
