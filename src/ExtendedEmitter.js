const EventEmitter = require('events')
const promiseToEmit = require('./promiseToEmit')

module.exports = class ExtendedEmitter extends EventEmitter {
  async promiseTo(resolveEventName, rejectEventName) {
    return new Promise((resolve, reject) => {
        this.on(rejectEventName, resolve)
        this.on(rejectEventName, resolve)
    }
  }
  close() {
    if (this.closed) return
    this.active = false
    this.closed = true
    this.promiseToClose.resolve()
  }
}
