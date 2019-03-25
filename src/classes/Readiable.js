module.exports = class Readiable extends Disposable {
  constructor() {
    super()
    this._resolver = new Resolver()
    this.tilDisposed.then( () =>  this.ready() )
  }

  ready() {
    this._resolver.resolve()
  }

  async tilReady() {
    return await this._resolver.get()
  }
}
