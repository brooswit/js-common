const EventEmitter = require('events')

module.exports = class ExtendedEmitter extends EventEmitter {
  constructor() {
    this.active = true
    this.closed = false
    this.promiseToClose = new Resolver()

    setTimeout(async () => {
      let promises = []
      promises.push(this.promiseToClose)
      promises.push(method(this))
      optionalParentProcess && promises.push(optionalParentProcess.promiseToClose)
      await Promise.race(promises)
      this.close()
    })
  }
  async promiseTo(eventName, context) {

  }
  close() {
    if (this.closed) return
    this.active = false
    this.closed = true
    this.promiseToClose.resolve()
  }
}
