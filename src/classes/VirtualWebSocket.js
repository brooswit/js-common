// Intended to be used with https://github.com/websockets/ws
const {fromEvent} = require('rxjs');
const Job = require('../classes/Job')
const generateHashCode = require('../functions/generateHashCode')

class VirtualWebSocketChannel extends Job {
    constructor(vws, handlerOrChannel) {
        super(async () => {
            this.untilOpen = this.promiseTo('open')

            this.subscribeTo(vws.observe('event'), (data) => this._handleEvent(data))
            this.subscribeTo(vws.observe('close'), () => this.end)
            if (typeof handlerOrChannel === 'string') {
                const channel = handlerOrChannel
                this._channel = channel
                // ... 'open' allready recieved ... //
                this.send('open/complete')
                this.emit('open', this)
                await this.untilEnd
            } else if (typeof handlerOrChannel === 'function') {
                const handler = handlerOrChannel
                this._channel = generateHashCode()
                this.send('open')
                await Promise.race([ this.unitlEnd(), this.promiseTo('open/complete') ])
                this.emit('open', this)
                await Promise.race([ this.unitlEnd(), await handler(this) ])
                this.close()
            } else {
                // ... this should never happen ... //
            }
        }, vws)
    }

    _handleEvent(data) {
        const { channel, eventName, payload } = data
        if (channel !== this._channel) { return }
        this.emit(eventName, {channel: this, operation, payload})
    }

    send(eventName, payload) {
        vws.send(channel, eventName, payload)
    }

    close() {
        this.send('close')
        this.end()
    }
}

module.exports = class VirtualWebSocket extends Job {
    constructor(ws, incomingOpenHandler, parent) {
        super(async () => {
            this._ws = ws;
            if (incomingOpenHandler) { this.subscribe(this.observe('open'), incomingOpenHandler) }

            this.subscribe(fromEvent(ws, 'message'), (message) => this._handleMessage(message))
            this.subscribe(fromEvent(ws, 'close'), () => this.end)
            this.subscribe(fromEvent(ws, 'error'), () => this.end)

            await this.untilEnd
        }, parent)
    }

    _handleMessage(message) {
        const data = JSONparseSafe(message)
        if (!data) { return }

        const { _vws } = data
        if (!_vws) { return }

        const { channel, eventName, payload } = data
        this.emit('event', {channel, eventName, payload})

        if(eventName !== 'open') { return }
        const vwsc = new VirtualWebSocketChannel(this, channel)
        this.emit('open', vwsc)
    }

    open(handler) {
        return new VirtualWebSocketChannel(this, handler)
    }

    send(channel, eventName, payload) {
        ws.send({ _vws: true, channel, eventName, payload})
    }
}
