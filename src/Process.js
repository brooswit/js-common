module.exports = class Process extends EventEmitter  {
    constructor(process) {
      this.active = true
      process(this)
    }
  
    close() {
      this.active = false
    }
  }