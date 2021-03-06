const Process = require('./Process')
const promiseToEmit = require('./promiseToEmit')



class EventListener extends Process {
    constructor(eventEmitter, eventName, callback, scope, once, parentProcess) {
        super(async ()=>{
            this.callback = callback
            this.scope = scope
            this._once = once
            
            let refId = eventEmitter._nextRefId ++
            eventEmitter._eventListeners[eventName] = eventEmitter._eventListeners[eventName] || {}
            eventEmitter._eventListeners[eventName][refId] = this
            
            await (Promise.race([eventEmitter.promiseToClose, this.promiseToClose]))
            
            delete eventEmitter._eventListeners[eventName][refId]
        }, parentProcess)
    }

    async emit(payload) {
        if(this._once) this.close()
        return await (this.callback.call(this.scope, payload))
    }
}

module.exports = class EventEmitter extends Process {
    constructor(parentProcess) {
        super(async() => { await (this.promiseToClose) , parentProcess})
        this._nextRefId = 0
        this._eventListeners = {}
    }

    on(eventName, callback, scope, parentProcess) {
        if(!callback) return promiseToEmit(this, eventName)
        return new EventListener(this, eventName, callback, scope, false, parentProcess)
    }

    once(eventName, callback, scope, parentProcess) {
        if(!callback) return promiseToEmit(this, eventName, true)
        return new EventListener(this, eventName, callback, scope, true, parentProcess)
    }

    off(eventName, callback, scope, parentProcess) {
        for(let eventListenerIndex in this._eventListeners[eventName]) {
            let eventListener = this._eventListeners[eventName][eventListenerIndex]
            if (eventListener.callback !== callback
                || eventListener.scope !== scope
                || eventListener.parentProcess !== parentProcess) continue;
            eventListener.close()
            break
        }
    }

    async emit(eventName, payload) {
        let promises = []
        for(let eventListenerIndex in this._eventListeners[eventName]) {
            let eventListener = this._eventListeners[eventName][eventListenerIndex]
            eventListener && promises.push(eventListener.emit(payload))
        }
        return await Promise.all(promises)
    }
}
