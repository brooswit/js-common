class EventListener extends Process {
    constructor(eventEmitter, eventName, callback, scope, once) {
        this.callback = callback
        this.scope = scope

        let refId = eventEmitter._nextRefId ++
        eventEmitter._eventListeners[eventName] = eventEmitter._eventListeners[eventName] || {}
        eventEmitter._eventListeners[eventName][refId] = this
        await eventEmitter.promiseToClose
        delete eventEmitter._eventListeners[eventName][refId]
    }
}

module.exports = class EventEmitter extends Process {
    constructor() {
        this._nextRefId = 0
        this._eventListeners = {}
        super(()=>{
            await this.promiseToClose
        })
    }

    on(eventName, callback, scope) {
        return new EventListener(eventName, callback, scope)
    }

    once(eventName, callback, scope) {
        return new EventListener(eventName, callback, scope, true)
    }

    off(eventName, callbackOrRefId, scope) {
        let callback = refId = callbackOrRefId
        for(let refId in this._eventListeners[eventName]) {
            let eventListener = this._eventListeners[refId]
            if (!(eventListener.callback === callback && eventListener.scope === scope) && !(eventListener.refId === refId)) continue;
            eventListener.close()
            break
        }
    }

    emit(eventName, payload) {

    }

}