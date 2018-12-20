const EventEmitter = require('events')
const MethodGroup = require('./MethodGroup')

module.exports = class MethodManager {
    constructor() {
        this._eventEmitter = new EventEmitter()
        this._methodGroups = {}
    }

    hook(groupName, method, context) {
        let methodGroup = this._methodGroups[groupName]
        if (!methodGroup) {
            methodGroup = this._methodGroups[groupName] = new MethodGroup()
            this._eventEmitter.on(`trigger:${groupName}`, methodGroup.trigger)
            this._eventEmitter.once(`close`, methodGroup.close)
        }

        let methodSocket = methodGroup.hook(method, context)

        this._eventEmitter.once(`stop:${methodSocket.id}`, methodSocket.close)
        this._eventEmitter.once(`close`, methodSocket.close)

        return methodSocket
    }

    trigger(groupName, value) {
        this._eventEmitter.emit(`trigger:${groupName}`, value)
    }

    stop(id) {
        this._eventEmitter.emit(`stop:${id}`)
    }

    close() {
        this._eventEmitter.emit(`close`)
    }
}
