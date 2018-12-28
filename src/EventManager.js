const EventEmitter = require('events')
const Process = require('./Process')
const PromiseToEmit = require('./PromiseToEmit')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new EventEmitter
  }

  trigger(eventName, payload) {
    console.debug(`triggering ${eventName}`)
    return new Process(async (process)=>{
      this._eventEmitter.trigger(eventName, payload)
    })
  }

  hook(eventName, callback, context) {
    console.debug(`hooking ${eventName}...`)
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, callback, context)
      await new PromiseToEmit(process, 'close', null, 'EventManager.hook')
      this._eventEmitter.off(eventName, callback, context)
  })
  }
}