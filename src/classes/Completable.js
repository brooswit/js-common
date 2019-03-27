const Future = require('./f')
module.exports = class Completable extends Disposable {
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
