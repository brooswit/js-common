const { ExtendedEmitter, Job } = require('../common')

module.exports = class EventManager {
  constructor() {
    this._eventEmitter = new ExtendedEmitter()
  }

  trigger(eventName, eventPayload) {
    return new Job(async (job)=>{
      this._eventEmitter.emit(eventName, eventPayload)
    })
  }

  hook(eventName, eventHandler, eventContext, parentJob) {
    return new Job(async (job) => {
      this._eventEmitter.on(eventName, eventHandler, eventContext, parentJob)
      await job.untilEnd
      this._eventEmitter.off(eventName, eventHandler, eventContext, parentJob)
  })
  }
}