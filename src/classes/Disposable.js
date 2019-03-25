module.exports = class Disposable {
  constructor() {
    this.isDisposed = false
    this._resolver = new Resolver()
  }

  dispose() {
    this.isDisposed = true
    this._resolver.resolve()
  }

  await tilDisposed() {
    await resolver
  }
}