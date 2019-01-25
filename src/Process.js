const Resolver = require('./Resolver')

module.exports = class Process extends ExtendedEvents {
  constructor(method, optionalParentProcess) {
    this.active = true
    this.closed = false
    this.promiseToClose = new Resolver()

    setTimeout(async () => {
      let promises = []
      promises.push(this.promiseToClose)
      promises.push(method(this))
      parentProcess && promises.push(parentProcess.promiseToClose)
      await (Promise.race(promises))
      this.close()
    })
  }
  
  close() {
    if (this.closed) return
    this.active = false
    this.closed = true
    this.promiseToClose.resolve()
  }
}
