module.exports = class Disposable {
  constructor() {
    this.isDisposed = false
    this._disposeResolvable = new Resolvable()
  }

  dispose() {
    this.isDisposed = true
    this._resolver.resolve()
  }

  await tilDisposed() {
    await resolver
  }
}