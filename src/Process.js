const {PromiseToEmit}
module.exports = class Process extends EventEmitter  {
  constructor(process, parentProcess) {
    this.active = true
    this.closed = false
    
    if (parentProcess) {
      this._parentProcess = parentProcess
      this._parentProcess.on('close', this.close, this)
    }

    process(this)
  }
  
  close() {
    this._parentProcess.off('close', this.close, this)
    this.active = false
    this.closed = true
    this.emit('close')
  }
}