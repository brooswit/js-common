const Resolver = require('../classes/Resolver')

class AsyncArray {
  constructor () {
    this._isDone = false
    this._internalArray = []
    this._requests = []
  }

  done () {
    console.log("ASYNC ARRAY DONE")
    this._isDone = true
    while (this._requests.length > 0) {
      this._resolveRequest()
    }
  }

  push (value) {
    if (this._isDone) return
    this._internalArray.push(value)
    this._resolveRequest()
  }

  unshift (value) {
    if (this._isDone) return
    this._internalArray.unshift(value)
    this._resolveRequest()
  }

  async pop () {
    await this._waitForContent()
    return this._internalArray.pop()
  }

  async shift () {
    await this._waitForContent()
    let value = this._internalArray.shift()
    return value
  }

  /* private methods */

  _resolveRequest () {
    let request = this._requests.shift()
    if (request) request.resolve()
  }

  async _waitForContent () {
    if (!this._isDone && this._internalArray.length === 0) {
      let resolver = new Resolver()
      this._requests.push(resolver)
      await resolver
    }
  }
}

module.exports = AsyncArray
