const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(processHandler, optionalParent) {
    this._destroyed = false

    setTimeout(async () => {
      const promiseThisWillClose = this.promiseTo('close')
      const promiseThisWIllComplete = processHandler(this)
      const promiseParentWillClose = optionalParent && optionalParent.promiseTo('close') || 
      let allPromises = [promiseThisWillClose, promiseThisWIllComplete]
      if (promiseParentWillClose) { allPromises.push(promiseParentWillClose) }
      await Promise.race(allClosures)
      this.close()
    })
  }

  isDestroyed() {
    return !!this._destroyed
  }

  
  async close() {
    if (this.isDestroyed()) return false
    await this._close(this)
    this.emit('close')
    return true
  }
}
