const Resolver = require('./Resolver')

module.exports = class Process  {
  constructor(method, parentProcess) {
    this.active = true
    this.closed = false
    this.promiseToClose = new Resolver()

    setTimeout(async () => {
      await (Promise.race([parentProcess.promiseToClose || undefined, this.promiseToClose, method(this)]))
      this.close()
    })
  }
  
  close() {
    if (this.closed) return
    this.active = false
    this.closed = true
    promiseToClose.resolve()
  }
}
