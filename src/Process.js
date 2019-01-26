const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(methods, optionalParentProcess) {
    this._init = methods.init || NO_OP
    this._main = methods.main || NO_OP
    this._close = methods.close || NO_OP
    this._closed = false

    setTimeout(async () => {
      await this._init()

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

  
  async close() {
    if (this._closed) return
    this._closed = true
    await this._close()
    this.emit('close')
  }
}
