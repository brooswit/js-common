module.exports = class Process extends EventEmitter  {
    constructor(process, parentProcess) {
      this.active = true
      if (parentProcess) {
          this._parentProcess = parentProcess
      }
      process(this)
    }
  
    close() {
      this.active = false
    }
  }