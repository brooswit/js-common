const Resolvable = require('./Resolvable')

module.exports = class Completable {
  constructor() {
    this._completeResolvable = new Resolvable()
  }

  complete(result) {
    this._completeResolvable.resolve(result)
  }

  async tilCompleted() {
    return await this._completeResolvable
  }
}
