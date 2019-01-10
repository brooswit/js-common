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
            this._contexts[eventName] = this._contexts[eventName] || {}
            this._contexts[eventName][refId] = {process, callback, scope}
            await this.promiseToClose
            delete this._contexts[eventName][refId]
        })
    }
    once(eventName, callback, scope) {
        return new Process((process)=>{
            let refId = this._nextRefId ++
            this._contexts[eventName] = this._contexts[eventName] || {}
            this._contexts[eventName][refId] = {process, callback, scope, once: true}
            await this.promiseToClose
            delete this._contexts[eventName][refId]
        })
    }
    off(eventName, callbackOrRefId, scope) {
        let callback = refId = callbackOrRefId
        for(let contextIndex in this._contexts[eventName]) {
            let context = this._contexts[contextIndex]
            if (!(context.callback === callback && context.scope === scope) && !(context.refId === refId)) continue;
            this._contexts[eventName].splice(contextIndex, 1);
            context.process.close()
        }
    }
    emit(eventName, payload) {

    }

}