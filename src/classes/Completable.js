const resolvable = require('./Resolvable')

module.exports = class Completable {
  constructor() {
    super()
    this._resolvable = new resolvable()
  }

  complete(result) {
    this._resolvable.set(result)
  }

  async tilCompleted() {
    return await this._resolvable.get()
  }
}
