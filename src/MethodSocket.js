const EventEmitter = require('events')

let nextId = 0

module.exports = class MethodSocket {
    constructor (optionalMethod, optionalContext) {
        this.id = nextId++

        this._eventEmitter = new EventEmitter()

        this._closed = false

        this._method = null
        this._context = null

        this.rehook(optionalMethod, optionalContext)
    }

    rehook(method, context) {
        if(this._closed) return
        this._method = method || null
        this._context = context || null
    }

    trigger(payload) {
        if(this._closed) return
        if (!this._method) return undefined
        return this._method.call(this._context, payload)
    }

    onClose(callback, context) {
        this._eventEmitter.on('close', callback, context)
    }

    close() {
        if(this._closed) return
        this._eventEmitter.emit('close')
        this.rehook()
        this._closed = true
    }
}