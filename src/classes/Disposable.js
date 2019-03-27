const Resolvable = require('resolvable')module.exports = class Disposable {
  constructor() {
    this.isDisposed = false
    this._disposeResolvable = new Resolvable()
  }

  dispose() {
    this.isDisposed = true
    this._disposeResolvable.resolve()
  }

  await tilDisposed() {
    await this._disposeResolvable
  }
}