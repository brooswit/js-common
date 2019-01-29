const NO_OP = require('./NO_OP')
const run = require('./run')
const ExtendedEmitter = require('./ExtendedEmitter')

module.exports = class Process extends ExtendedEmitter {
  constructor(processHandler, optionalParent) {
    run(async () => {
      this._active = true

      this.untilEnd = this.promiseTo('end')

      const promiseThisWillEnd = this.untilEnd
      const promiseThisWIllComplete = processHandler(this)
      const promiseParentWillClose = optionalParent && optionalParent.untilEnd

      const allPromises = [promiseThisWillEnd, promiseThisWIllComplete]
      if (optionalParent) { allPromises.push(promiseParentWillClose) }

      await Promise.race(allPromises)

      this.end()
    })
  }

  subscribeTo(observable, handler) {
    if (this.isActive()) {
      const subscription = observable.subscribe(handler)
      new Process(async (process) => {
        await process.untilEnd
        subscription.unsubscribe()
      }, this)
      return subscription
    }
  }

  isActive() {
    return !!this._active
  }

  
  end() {
    if (!this.isActive()) return false
    this._active = false
    this.emit('end')
    return true
  }
}
