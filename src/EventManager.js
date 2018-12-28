const EventEmitter = require('events')
const Process = require('./Process')
const PromiseToAdmit = require('./PromiseToAdmit')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new EventEmitter
  }

  trigger(eventName, payload) {
    return new Process(async (process)=>{
      this._eventEmitter.trigger(eventName, payload)
    })
  }

  hook(eventName, callback, context) {
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, callback, context)
      await new PromiseToEmit(process, 'close')
      this._eventEmitter.off(eventName, callback, context)
    })
  }
}