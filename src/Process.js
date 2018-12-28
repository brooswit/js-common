const EventEmitter = require('events')
module.exports = class Process extends EventEmitter  {
  constructor(method, parentProcess) {
    super()
    console.debug(`new Process`)

    this.active = true
    this.closed = false
    
    if (parentProcess) {
      this._parentProcess = parentProcess
      this._parentProcess.on('close', this.close, this)
    }
    console.debug(`doing method`)
    method(this)
    console.debug(`method done`)
  }
  
  close() {
    console.debug(`close Process`)
    this._parentProcess.off('close', this.close, this)
    this.active = false
    this.closed = true
    this.emit('close')
  }
}
