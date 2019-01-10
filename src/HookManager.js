const EventEmitter = require('events')

module.exports = class HookManager {
    constructor() {
        this._eventEmitter = new EventEmitter()
        this._eventEmitter.setMaxListeners(65535)
    }

    hook(methodManager, eventName, method, context) {
        const methodSocket = methodManager.hook(eventName, method, context)
        const {id} = methodSocket

        this._eventEmitter.once(`stop:${id}`, methodSocket.close)
        this._eventEmitter.once(`close`, methodSocket.close)

        return methodSocket
    }

    stop(id) {
        this._eventEmitter.emit(`stop:${id}`)
    }

    close() {
        this._eventEmitter.emit(`close`)
    }
}