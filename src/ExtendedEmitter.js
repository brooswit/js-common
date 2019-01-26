const EventEmitter = require('events')

const promiseToEmit = require('./promiseToEmit')

module.exports = class ExtendedEmitter extends EventEmitter {
  async promiseTo(resolveEventName, rejectEventName) {
      return promiseToEmit(this, resolveEventName, rejectEventName)
  }
}
