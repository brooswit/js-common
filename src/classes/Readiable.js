const Resolvable = require('./Resolvable')

module.exports = class Readiable  {
  constructor() {
    this._readyResolvable = new Resolvable()
  }

  ready() {
    this._readyResolvable.resolve()
  }

  async tilReady() {
    return await this._readyResolvable.get()
  }
}
