const Future = require('./Future')

module.exports = class Completable e {
  constructor() {
    super()
    this._future = new Future()
    this.tilDisposed.then( () =>  this.complete() )
  }

  complete(result) {
    this._future.set(result)
  }

  async tilCompleted() {
    return await this._future.get()
  }
}
