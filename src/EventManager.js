const EventEmitter = require('./EventEmitter')
const Process = require('./Process')
const promiseToEmit = require('./promiseToEmit')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new EventEmitter()
    this._eventEmitter.setMaxListeners(65535)
  }

  trigger(eventName, eventPayload) {
    return new Process(async (process)=>{
      this._eventEmitter.emit(eventName, eventPayload)
    })
  }

  hook(eventName, eventHandler, eventContext) {
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, eventHandler, eventContext)
      let promise = promiseToEmit(process, 'close', null, 'EventManager.hook')
      await promise
      this._eventEmitter.off(eventName, eventHandler, eventContext)
  })
  }
}