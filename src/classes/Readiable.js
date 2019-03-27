const 

module.exports = class Readiable  {
  constructor() {
    super()
    this._resolver = new Resolver()
  }

  ready() {
    this._resolver.resolve()
  }

  async tilReady() {
    return await this._resolver.get()
  }
}
