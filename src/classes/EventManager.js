const Routine = require('../classes/Routine')
const ExtendedEmitter = require('../classes/ExtendedEmitter')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new ExtendedEmitter()
  }

  trigger(eventName, eventPayload) {
    return new Routine(async (routine)=>{
      this._eventEmitter.emit(eventName, eventPayload)
    })
  }

  hook(eventName, eventHandler, eventContext, parentRoutine) {
    return new Routine(async (routine) => {
      this._eventEmitter.on(eventName, eventHandler, eventContext, parentRoutine)
      await routine.untilEnd
      this._eventEmitter.off(eventName, eventHandler, eventContext, parentRoutine)
  })
  }
}