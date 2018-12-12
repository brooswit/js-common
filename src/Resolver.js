const NO_OP = require('./NO_OP')

module.exports = class Resolver extends Promise {
  constructor (resolver = NO_OP) {
    super((resolve, reject) => {
      this._didComplete = false
      this._didReject = false
      this._didResolve = false

      this._resolver = resolve
      this._rejecter = reject

      resolver(this.resolve, this.reject)
    })
  }

  resolve (value) {
    this._didComplete = true
    this._didResolve = true
    this._resolver(value)
  }

  reject (err) {
    this._didComplete = true
    this._didReject = true
    this._rejecter(err)
  }
  didComplete () {
    return this._didComplete
  }
  didResolve () {
    return this._didResolve
  }
  didReject () {
    return this._didReject
  }
}
