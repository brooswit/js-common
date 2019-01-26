const Resolver = require('./Resolver')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(method, optionalParentProcess) {
    this._closed = false
    this.promiseToClose = new Resolver()

    setTimeout(async () => {
      let promises = []
      promises.push(this.promiseTo('close'))
      promises.push(method(this))
      optionalParentProcess && promises.push(optionalParentProcess.promiseTo('close'))

      await Promise.race(promises)
      this.close()
    })
  }

  isClosed() {
    return !!this._closed
  }

  
  close() {
    if (this._closed) return
    this.active = false
    this._closed = true
    this.emit('close')
  }
}
