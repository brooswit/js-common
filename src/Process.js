module.exports = class Process extends EventEmitter  {
  constructor(process, parentProcess) {
    this.active = true
    if (parentProcess) {
      this._parentProcess = parentProcess
      parentProcess.on('close', this.close, this)
    }
    process(this)
  }
  
    close() {
      this.emit('close')
      this.active = false
    }
  }