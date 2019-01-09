const EventEmitter = require('events')
const promiseToEmit = require('./promiseToEmit')
module.exports = class Process extends EventEmitter  {
  constructor(method, parentProcess) {
    super()

    this.active = true
    this.closed = false
    this.promiseToClose = promiseToEmit(this, 'close')
    
    if (parentProcess) {
      this._parentProcess = parentProcess
      this._parentProcess.on('close', this.close, this)
    }

    setTimeout(()=>{method(this)})
  }
  
  close() {
    if (this.closed) return
    if (this._parentProcess) {
      this._parentProcess.off('close', this.close, this)
    }
    this.active = false
    this.closed = true
    this.emit('close')
  }
}
