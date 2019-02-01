const EventEmitter = require('events')

const { fromEvent } = require('rxjs');
const { promiseToEmit } = require('../common')

module.exports = class ExtendedEmitter extends EventEmitter {
  async promiseTo(resolveEventName, rejectEventName) {
      return promiseToEmit(this, resolveEventName, rejectEventName)
  }

  observe(eventName) {
    return fromEvent(this, eventName)
  }
}
