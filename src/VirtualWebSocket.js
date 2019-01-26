// Intended to be used with https://github.com/websockets/ws

const {fromEvent} = require('rxjs');

const Process = require('./Process')

module.exports = class VirtualWebSocket extends Process {
    constructor(ws, {channel, parent}) {
        super(async () => {
            this._ws = ws;

            this.subscribe(fromEvent(ws, "message"), this._handleMessage)
            const mainChannel = this.channel('main')
            if (channel) {
                this.channel = channel
            } else {
                this.channel = await mainChannel.request('new-channel')
            }

            // Negotiate channel
            
            // this.subscribe(fromEvent(ws, "open"), this._handleOpen)
            // this.subscribe(fromEvent(ws, "close"), this._handleClose)
            // this.subscribe(fromEvent(ws, "upgrade"), this._handleUpgrade)
            // this.subscribe(fromEvent(ws, "ping"), this._handlePing)
            // this.subscribe(fromEvent(ws, "pong"), this._handlePong)
            // this.subscribe(fromEvent(ws, "error"), this._handleError)
            // this.subscribe(fromEvent(ws, "unexpected-response"), this._handleUnexpectedResponse)

            await this.promiseTo('destroy')
            this.send('close')
        }, parent)
    }

    channel(channel) {
        new VirtualWebSocket(this._ws, {channel, parent: this})
    }

    ping() {
        const pingId = VirtualWebSocket._nextPingId ++
        this.send('ping', {pingId})
    }

    message(event, optionalPayload) {
        this._send('message', event, optionalPayload)
    }
    
    async request(event, optionalPayload) {
        const requestId = VirtualWebSocket._nextRequestId ++
        this._send('request', event, optionalPayload, {requestId})
        await this.promiseTo('respone-${requestId}')
    }
    
    _send(operation, event, optionalPayload, optionalAdditionalAttributes) {
        const channel = this._channel
        const payload = optionalPayload
        const messageId = VirtualWebSocket._nextMessageId ++
        const additionalAttributes = optionalAdditionalAttributes || {}
        this._ws.send(Object.assign({ messageId, channel, operation, event, payload }, additionalAttributes))
    }

    _handleMessage(body) {
        const { messageId, requestId, channel, operation, event, payload } = JSONparseSafe(body)
        if (channel === this._channel) {
            if (operation === 'close') {
                this.close()
            } else if (operation === 'message') {
                this.emit('message', payload)
            } else if (operation === 'request') {
                new Process((process) => {
                    const resolver = new resolver()
                    this.emit('request', payload, resolver.resolve)
                    const response = await resolver
                    this.emit(`respone-${requestId}`, response)
                    
                })
            } else if (operation === 'ping') {
                this.send('pong', payload)
                this.emit('ping', payload)
            }
        }
    }

    // _handleOpen() {}
    // _handleClose() {}
    // _handleUpgrade() {}
    // _handlePing() {}
    // _handlePong() {}
    // _handleError() {}
    // _handleUnexpectedResponse() {}

    // get binaryType() { return this._ws.binaryType }
    // get bufferedAmount() { return this._ws.bufferedAmount }
    // get extensions() { return this._ws.extensions }
    // get onclose() { return this._ws.onclose }
    // get onerror() { return this._ws.onerror }
    // get onmessage() { return this._ws.onmessage }
    // get onopen() { return this._ws.onopen }
    // get protocol() { return this._ws.protocol }
    // get readyState() { return this._ws.readyState }
    // get url() { return this._ws.url }

    // websocket.ping([data[, mask]][, callback])
    // websocket.pong([data[, mask]][, callback])
    // websocket.addEventListener(type, listener)
    // websocket.close([code[, reason]])
    // websocket.removeEventListener(type, listener)
    // websocket.send(data[, options][, callback])
    // websocket.terminate()

}

VirtualWebSocket._nextPingId = 0
VirtualWebSocket._nextMessageId = 0
