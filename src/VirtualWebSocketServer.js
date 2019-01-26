// Intended to be used with https://github.com/websockets/ws
const {fromEvent} = require('rxjs');
const VirtualWebSocket = require('./VirtualWebSocket')
const Process = require('./Process')

module.exports = class VirtualWebSocketServer extends Process {
    constructor(wss) {
        super(async () => {
            const connectionObserver = fromEvent(wss, 'connection')
            this.subscribe(connectionObserver, this._handleConnection)
            await this.promiseTo('destroy')
        })
    }

    _handleConnection(ws) {
        new VirtualWebSocket(ws, {serverMode: true, parent: this})
    }

    ping() {
        const pingId = VirtualWebSocket._nextPingId ++
        this.send('ping', {pingId})
    }
    
    send(event, optionalPayload, optionalChannel) {
        const channel = optionalChannel || this._channel
        const payload = optionalPayload
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
