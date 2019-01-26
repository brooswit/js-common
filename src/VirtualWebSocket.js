const {fromEvent} = require('rxjs');

const Process = require('./Process')

module.exports = class VirtualWebSocket extends Process {
    constructor(ws, optionalChannel) {
        super(async () => {
            this._ws = ws;

            if (optionalChannel) {
                this.channel = optionalChannel
            } else {
                this.channel = VirtualWebSocket._nextVirtualWebSocketChannel ++
            }
            
            this._observable = fromEvent(ws, "message")
            this._subscription = this._observable.subscribe(this._handleMessage)

            await this.promiseTo('close')
            this.send('close')
            this._subscription.unsubscribe()
        })
    }

    ping() {
        const pingId = VirtualWebSocket._nextPingId ++
        this.send('ping', {pingId})
    }
    
    send(event, optionalPayload) {
        const channel = this._channel
        const payload = optionalPayload || {}
        this._ws.send({ channel, event, payload })
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

VirtualWebSocket._nextVirtualWebSocketChannel = 0
VirtualWebSocket._nextPingId = 0
VirtualWebSocket._nextMessageId = 0
