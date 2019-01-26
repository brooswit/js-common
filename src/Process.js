const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(handler, optionalParentProcess) {
    this._closed = false

    setTimeout(async () => {
      let promises = []
      promises.push(this.promiseTo('close'))
      
      promises.push(handler(this))
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
    await this._close(this)
    this.emit('close')
    return true
  }
}
