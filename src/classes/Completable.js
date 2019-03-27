const Future = require('./Future')

module.exports = class Completable {
  constructor() {
    super()
    this._future = new Future()
  }

  complete(result) {
    this._future.set(result)
  }

  async tilCompleted() {
    return await this._future.get()
  }
}
