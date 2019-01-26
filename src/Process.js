const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(methods, optionalParentProcess) {
    this._initialize = methods._initialize || NO_OP
    this._closed = false

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
