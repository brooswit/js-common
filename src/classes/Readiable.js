const Resolvable = require('./Resolvable')

module.exports = class Readiable  {
  constructor() {
    this._resolver = new Resolver()
  }

  ready() {
    this._resolver.resolve()
  }

  async tilReady() {
    return await this._resolver.get()
  }
}
