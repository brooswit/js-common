const { run, ExtendedEmitter } = require('../common')

module.exports = class Job extends ExtendedEmitter {
  constructor(mainHandler, optionalParent) {
    super()
    run(async () => {
      this._active = true

      this._promiseToEnd = this.promiseTo('end')

      const promiseThisWillEnd = this.untilEnd
      const promiseThisWillComplete = mainHandler(this)
      const promiseParentWillClose = optionalParent && optionalParent.untilEnd

      const allPromises = [promiseThisWillEnd, promiseThisWillComplete]
      if (optionalParent) { allPromises.push(promiseParentWillClose) }

      await Promise.race(allPromises)

      this.end()
    })
  }

  get untilEnd() {
    return this._promiseToEnd
  }

  get isActive() {
    return !!this._active
  }

  subscribeTo(observable, handler) {
    if (this.isActive) {
      const subscription = observable.subscribe(handler)
      new Job(async (job) => {
        await job.untilEnd
        subscription.unsubscribe()
      }, this)
      return subscription
    }
  }

  end() {
    if (!this.isActive) return false
    this._active = false
    this.emit('end')
    return true
  }
}
