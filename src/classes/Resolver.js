const { NO_OP } = require('../common')

module.exports = class Resolver {
  constructor (resolver = NO_OP) {
    this._promise = new Promise((resolve, reject) => {
      this._didComplete = false
      this._didReject = false
      this._didResolve = false

      this._resolver = resolve
      this._rejecter = reject

      resolver(this.resolve, this.reject)
    })
  }

  then() {
    this._promise.then.apply(this._promise, arguments)
  }

  catch() {
    this._promise.catch.apply(this._promise, arguments)
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
