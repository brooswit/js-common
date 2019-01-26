const NO_OP = require('./NO_OP')
const ExtendedEvents = require('./ExtendedEvents')

module.exports = class Process extends ExtendedEvents {
  constructor(processHandler, optionalParent) {
    this._destroyed = false

    setTimeout(async () => {
      const promiseThisWillClose = this.promiseTo('close')
      const promiseThisWIllComplete = processHandler(this)
      const promiseParentWillClose = optionalParent && optionalParent.promiseTo('close')

      const allPromises = [promiseThisWillClose, promiseThisWIllComplete]
      if (promiseParentWillClose) { allPromises.push(promiseParentWillClose) }
      const anyPromise = Promise.race(allPromises)

      await anyPromise
      this.destroy()
    })
  }

  subscribe(observable, handler) {
    if (this.isDestroyed()) return false
    const subscription = observable.subscribe(handler)
    await this.promiseTo('close')
  }

  isDestroyed() {
    return !!this._destroyed
  }

  
  async destroy() {
    if (this.isDestroyed()) return false
    await this._destroy(this)
    this.emit('destroy')
    return true
  }
}
