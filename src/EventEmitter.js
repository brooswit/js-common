class EventListener extends Process {
    constructor()
}

module.exports = class EventEmitter extends Process {
    constructor() {
        this._nextRefId = 0
        super(()=>{
            await this.promiseToClose
        })
    }
    on(eventName, callback, scope) {
        return new Process((process)=>{
            let refId = this._nextRefId ++
            this._contexts[eventName] = this._contexts[eventName] || []
            this._contexts[eventName].push({refId, callback, scope})
            await this.promiseToClose
        })
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
            if (context.refId === refId) break;
            if (context.callback === callback && context.scope === scope)
        }
    }
    emit(eventName, payload) {

    }

}