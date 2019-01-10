module.exports = class EventEmitter extends Process {
    constructor() {
        super(()=>{
            await this.promiseToClose
        })
    }
    on(eventName, callback, scope) {
        this._contexts[eventName] = this._contexts[eventName] || []
        this._contexts[eventName].push({callback, scope})
    }
    once(eventName, callback, scope) {
        this._contexts[eventName] = this._contexts[eventName] || []
        this._contexts[eventName].push({callback, scope, once: true})
    }
    off(eventName, callback, scope)
    emit(eventName, payload)

}