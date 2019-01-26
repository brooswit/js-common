const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(processHandler, optionalParent) {
    this._closed = false

    setTimeout(async () => {
      let promises = []
      promises.push(this.promiseTo('close'))
      promises.push(processHandler(this))
      if (!!optionalParent) { promises.push(optionalParent.promiseTo('close')) }
      await Promise.race(promises)
      this.close()
    })
  }

  isClosed() {
    return !!this._closed
  }

  
  async close() {
    if (this.isClosed()) return false
    await this._close(this)
    this.emit('close')
    return true
  }
}
