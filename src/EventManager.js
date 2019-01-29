const EventEmitter = require('./EventEmitter')
const Process = require('./Process')
const promiseToEmit = require('./promiseToEmit')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new EventEmitter()
  }

  trigger(eventName, eventPayload) {
    return new Process(async (process)=>{
      this._eventEmitter.emit(eventName, eventPayload)
    })
  }

  hook(eventName, eventHandler, eventContext, parentProcess) {
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, eventHandler, eventContext, parentProcess)
      await process.untilEnd
      this._eventEmitter.off(eventName, eventHandler, eventContext, parentProcess)
  })
  }
}