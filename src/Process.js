const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(methods, optionalParentProcess) {
    this._closed = false

    setTimeout(async () => {
      await (methods.init || NO_OP)(this)

      let promises = []
      promises.push(this.promiseTo('close'))
      
      methods.main && promises.push(methods.main(this))
      optionalParentProcess && promises.push(optionalParentProcess.promiseTo('close'))
      await Promise.race(promises)

      this.close()
    })
  }

  isClosed() {
    return !!this._closed
  }

  
  async close() {
    if (this.isClosed()) return false
    this._closed = true
    await this._close(this)
    this.emit('close')
    return true
  }
}
