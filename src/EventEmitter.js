class EventListener extends Process {
    constructor(eventEmitter, eventName, callback, scope, once) {
        this.callback = callback
        this.scope = scope
        this._once = once

        let refId = eventEmitter._nextRefId ++
        eventEmitter._eventListeners[eventName] = eventEmitter._eventListeners[eventName] || {}
        eventEmitter._eventListeners[eventName][refId] = this

        await Promise.race([this.promiseToClose, eventEmitter.promiseToClose])

        delete eventEmitter._eventListeners[eventName][refId]
    }

    emit(payload) {
        if(this._once) this.close()
        return await this.callback.call(this.scope, payload)
    }
}

module.exports = class EventEmitter extends Process {
    constructor() {
        super(()=>{ await this.promiseToClose })
        this._nextRefId = 0
        this._eventListeners = {}
    }

    on(eventName, callback, scope) {
        if(!callback) return promiseToEmit(this, eventName)
        return new EventListener(eventName, callback, scope)
    }

    once(eventName, callback, scope) {
        if(!callback) return promiseToEmit(this, eventName, true)
        return new EventListener(eventName, callback, scope, true)
    }

    off(eventName, callbackOrRefId, scope) {
        eventListener = this._find(eventName, callbackOrRefId, scope)
        eventListener && eventListener.close()
    }

    async emit(eventName, payload) {
        let promises = []
        for(let eventListenerIndex in this._eventListeners[eventName]) {
            let eventListener = this._eventListeners[eventName][eventListenerIndex]
            promises.push(eventListener && eventListener.emit(payload))
        }
        return await Promise.all(promises)
    }

    _find(eventName, callbackOrRefId, scope) {
        let callback = refId = callbackOrRefId
        for(let eventListenerIndex in this._eventListeners[eventName]) {
            let eventListener = this._eventListeners[eventListenerIndex]
            if (!(eventListener.callback === callback && eventListener.scope === scope) && !(eventListener.refId === refId)) continue;
            return eventListener
        }
    }
}
