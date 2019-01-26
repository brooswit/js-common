// Intended to be used with https://github.com/websockets/ws

const {fromEvent} = require('rxjs');

const Process = require('./Process')

module.exports = class VirtualWebSocket extends Process {
    constructor(ws, {channel, parent}) {
        super(async () => {
            this._ws = ws;

            this.subscribe(fromEvent(ws, 'message'), this._handleMessage)
            this.subscribe(fromEvent(ws, 'close'), this.close)

            const mainChannel = this.withChannel('main')

            if (channel) {
                this.channel = channel
            } else {
                this.channel = await mainChannel.request('new-channel')
            }

            this.emit('open')

            // this.subscribe(fromEvent(ws, 'open'), this._handleOpen)
            // this.subscribe(fromEvent(ws, 'upgrade'), this._handleUpgrade)
            // this.subscribe(fromEvent(ws, 'ping'), this._handlePing)
            // this.subscribe(fromEvent(ws, 'pong'), this._handlePong)
            // this.subscribe(fromEvent(ws, 'error'), this._handleError)
            // this.subscribe(fromEvent(ws, 'unexpected-response'), this._handleUnexpectedResponse)

            await this.promiseTo('destroy')
            this.message('close')
        }, parent)
    }

    withChannel(channel) {
        new VirtualWebSocket(this._ws, {channel, parent: this})
    }

    message(event, optionalPayload) {
        this._send('message', {event}, optionalPayload)
    }
    
    close() {
        this.destroy()
    }

    async request(method, optionalPayload) {
        const requestId = VirtualWebSocket._nextRequestId ++
        this._send('request', {method, requestId}, optionalPayload)
        const response = await this.promiseTo(`_respone-${requestId}`)
        if (this.isClosed()) return

        return response
    }

    respond(requestId, optionalPayload) {
        this._send('response', {requestId}, optionalPayload)
    }
    
    _send(operation, optionalAttributes, optionalPayload) {
        const channel = this._channel
        const attributes = optionalAttributes || {}
        const payload = optionalPayload
        const messageId = VirtualWebSocket._nextMessageId ++

        this._ws.send(Object.assign({ messageId, channel, operation, payload }, attributes))
    }

    _handleMessage(body) {
        const data = JSONparseSafe(body)
        const { messageId, channel, operation, payload } = data
        if (channel === this._channel) {
            if (operation === 'close') {
                this.destroy()
            } else if (operation === 'message') {
                const {event} = data
                this.emit(event, payload)
            } else if (operation === 'request') {
                const {method, requestId} = data
                new Process(async (process) => {
                    const resolver = new Resolver()
                    this.emit(method, payload, resolver.resolve)
                    const response = await resolver
                    if (process.isClosed()) return
                    this.respond(requestId, response)
                }, this)
            } else if (operation === 'response') {
                const {requestId} = data
                this.emit(`_response-${requestId}`, payload)
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
