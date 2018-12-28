const EventEmitter = require('events')
const Process = require('./Process')
const PromiseToEmit = require('./PromiseToEmit')

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
    console.debug(`hooking ${eventName}...`)
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, eventHandler, eventContext)
      console.debug(`setup ${eventName}...`)
      let promise = new PromiseToEmit(process, 'close', null, 'EventManager.hook')
      console.debug(`setup ${eventName}...`)

      this._eventEmitter.off(eventName, eventHandler, eventContext)
  })
  }
}