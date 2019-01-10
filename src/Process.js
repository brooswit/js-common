const EventEmitter = require('events')
const promiseToEmit = require('./promiseToEmit')
module.exports = class Process  {
  constructor(method, parentProcess) {
    super()

    this.active = true
    this.closed = false
    this.promiseToClose = new Resolver()

    setTimeout(async () => {
      await Promise.race([parentProcess.promiseToClose, this.promiseToClose, method(this)])
      this.close()
    })
  }
  
  close() {
    if (this.closed) return
    if (this._parentProcess) {
      this._parentProcess.off('close', this.close, this)
    }
    this.active = false
    this.closed = true
    promiseToClose.resolve()
  }
}
