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
            this._contexts[eventName].push({process, refId, callback, scope})
            await this.promiseToClose
        })
    }
    once(eventName, callback, scope) {
        return new Process((process)=>{
            let refId = this._nextRefId ++
            this._contexts[eventName] = this._contexts[eventName] || []
            this._contexts[eventName].push({process, refId, callback, scope, once: true})
        })
    }
    off(eventName, callbackOrRefId, scope) {
        let callback = refId = callbackOrRefId
        for(let contextIndex in this._contexts) {
            let context = this._contexts[contextIndex]
            if (!(context.callback === callback && context.scope === scope) && !(context.refId === refId)) continue;
            if ()
        }
    }
    emit(eventName, payload) {

    }

}