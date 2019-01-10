class EventListener extends Process {
    constructor(eventEmitter, eventName, callback, scope, once) {
        let refId = eventEmitter._nextRefId ++
        eventEmitter._contexts[eventName] = eventEmitter._contexts[eventName] || {}
        eventEmitter._contexts[eventName][refId] = {process, callback, scope, once}
        await eventEmitter.promiseToClose
        delete eventEmitter._contexts[eventName][refId]
    }
}

module.exports = class EventEmitter extends Process {
    constructor() {
        this._nextRefId = 0
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
        for(let contextIndex in this._contexts[eventName]) {
            let context = this._contexts[contextIndex]
            if (!(context.callback === callback && context.scope === scope) && !(context.refId === refId)) continue;
            context.process.close()
            break
        }
    }
    emit(eventName, payload) {

    }

}