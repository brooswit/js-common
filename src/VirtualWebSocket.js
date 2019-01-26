// Intended to be used with https://github.com/websockets/ws

const {fromEvent} = require('rxjs');

const Process = require('./Process')
const NO_OP = require('./NO_OP')

module.exports = class VirtualWebSocket extends Process {
    constructor(ws, optionalChannel) {
        super(async () => {
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

    get binaryType() { return this._ws.binaryType }
    get bufferedAmount() { return this._ws.bufferedAmount }
    get extensions() { return this._ws.extensions }
    get onclose() { return this._ws.onclose }
    get onerror() { return this._ws.onerror }
    get onmessage() { return this._ws.onmessage }
    get onopen() { return this._ws.onopen }
    get protocol() { return this._ws.protocol }
    get readyState() { return this._ws.readyState }
    get url() { return this._ws.url }

    ping() {
        const pingId = VirtualWebSocket._nextPingId ++
        this.send('ping', {pingId})
    }

    
    send(event, optionalPayload, optionalChannel) {
        const channel = optionalChannel || this._channel
        const payload = optionalPayload
        const id = VirtualWebSocket._nextMessageId ++
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

    // websocket.ping([data[, mask]][, callback])
    // websocket.pong([data[, mask]][, callback])
    // websocket.addEventListener(type, listener)
    // websocket.close([code[, reason]])
    // websocket.removeEventListener(type, listener)
    // websocket.send(data[, options][, callback])
    // websocket.terminate()

}

VirtualWebSocket._nextVirtualWebSocketChannel = 0
VirtualWebSocket._nextPingId = 0
VirtualWebSocket._nextMessageId = 0
