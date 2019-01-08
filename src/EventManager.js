const EventEmitter = require('events')
const Process = require('./Process')
const promiseToEmit = require('./promiseToEmit')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new EventEmitter
  }

  trigger(eventName, eventPayload) {
    console.debug(`triggering ${eventName}`)
    return new Process(async (process)=>{
      this._eventEmitter.trigger(eventName, eventPayload)
    })
  }

  hook(eventName, eventHandler, eventContext) {
    console.debug(`hooking ${eventName}`)
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, eventHandler, eventContext)
      let promise = promiseToEmit(process, 'close', null, 'EventManager.hook')
      await promise
      this._eventEmitter.off(eventName, eventHandler, eventContext)
  })
  }
}