module.exports = class EventEmitter extends Process {
    constructor() {
        this._nextRefId = 0
        super(()=>{
            await this.promiseToClose
        })
    }
    on(eventName, callback, scope) {
        let refId = this._nextRefId ++
        this._contexts[eventName] = this._contexts[eventName] || []
        this._contexts[eventName].push({refId, callback, scope})
    }
    once(eventName, callback, scope) {
        let refId = this._nextRefId ++
        this._contexts[eventName] = this._contexts[eventName] || []
        this._contexts[eventName].push({refId, callback, scope, once: true})
    }
    off(eventName, callbackOrRefId, scope) {
        let callback = refId = callbackOrRefId
        for(let contextIndex in this._contexts) {
            let context = this._contexts[contextIndex]
            if (context.callback = )
        }
    }
    emit(eventName, payload) {

    }

}