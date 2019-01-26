// Intended to be used with https://github.com/websockets/ws

const {fromEvent} = require('rxjs');

const Process = require('./Process')
const NO_OP = require('./NO_OP')

module.exports = class VirtualWebSocket extends Process {
    constructor(ws, optionalChannel) {
        super(async () => {
            // this.binaryType = "STRING"
            // this.bufferedAmount = 1234
            // this.extensions = {}
            // this.onclose = NO_OP
            // this.onerror = NO_OP
            // this.onmessage = NO_OP
            // this.onopen = NO_OP
            // this.protocol = "STRING"
            // this.readyState = 1234
            // this.url = "STRING"

            this._ws = ws;

            if (optionalChannel) {
                this.channel = optionalChannel
            } else {
                this.channel = VirtualWebSocket._nextVirtualWebSocketChannel ++
            }

            this.subscribe(fromEvent(ws, "message"), this._handleMessage)
            this.subscribe(fromEvent(ws, "open"), this._handleOpen)
            this.subscribe(fromEvent(ws, "close"), this._handleClose)
            this.subscribe(fromEvent(ws, "upgrade"), this._handleUpgrade)
            this.subscribe(fromEvent(ws, "ping"), this._handlePing)
            this.subscribe(fromEvent(ws, "pong"), this._handlePong)
            this.subscribe(fromEvent(ws, "error"), this._handleError)
            this.subscribe(fromEvent(ws, "unexpected-response"), this._handleUnexpectedResponse)

            await this.promiseTo('destroy')
            this.send('close')
            this._subscription.unsubscribe()
        })
    }

    // websocket.ping([data[, mask]][, callback])
    ping() {
        const pingId = VirtualWebSocket._nextPingId ++
        this.send('ping', {pingId})
    }
    // websocket.pong([data[, mask]][, callback])

    
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

    // websocket.addEventListener(type, listener)
    // websocket.close([code[, reason]])
    // websocket.removeEventListener(type, listener)
    // websocket.send(data[, options][, callback])
    // websocket.terminate()

}

VirtualWebSocket._nextVirtualWebSocketChannel = 0
VirtualWebSocket._nextPingId = 0
VirtualWebSocket._nextMessageId = 0
