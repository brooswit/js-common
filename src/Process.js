const EventEmitter = require('events')
module.exports = class Process extends EventEmitter  {
  constructor(method, parentProcess) {
    super()
    this.active = true
    this.closed = false
    
    if (parentProcess) {
      this._parentProcess = parentProcess
      this._parentProcess.on('close', this.close, this)
    }
    method(this)
  }
  
  close() {
    this._parentProcess.off('close', this.close, this)
    this.active = false
    this.closed = true
    this.emit('close')
  }
}