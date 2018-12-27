const {Process} = require('./Process')
class EventManager {
  constructor() {
    
  }

  trigger(eventName, payload) {

  }

  hook(eventName, callback, context) {
    return new Process(async (process) => {
      this._eventEmitter.on(eventName, callback, context)
      await new PromiseToEmit(process, 'close')
      this._eventEmitter.off(eventName, callback, context)
    })
  }
}