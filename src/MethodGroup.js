const EventEmitter = require('events')
const MethodSocket = require('./MethodSocket')

module.exports = class MethodGroup {
    constructor() {
        this._eventEmitter = new EventEmitter()
    }

    hook(method, context) {
        const methodSocket = new MethodSocket(method, context)
        const {id} = methodSocket

        this._eventEmitter.on(`trigger`, methodSocket.trigger)
        this._eventEmitter.once(`stop:${id}`, methodSocket.close)
        this._eventEmitter.once(`close`, methodSocket.close)

        return methodSocket
    }

    trigger(payload) {
        this._eventEmitter.emit(`trigger`, payload)
    }

    stop(id) {
        this._eventEmitter.emit(`stop:${id}`)
    }

    close() {
        this._eventEmitter.emit(`close`)
    }
}