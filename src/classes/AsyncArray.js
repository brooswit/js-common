const Resolver = require('../classes/Resolver')
const Routine = require('../classes/Routine')

class AsyncArray extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._requestQueue = []
    this._payloadQueue = []
  }

  push (payload) {
    if(!this.isActive) return
    this._internalArray.push(payload)
    this._resolveRequest()
  }

  unshift (payload) {
    if (this._isDone) return
    this._internalArray.unshift(payload)
    this._resolveRequest()
  }

  async pop () {
    await this._waitForContent()
    return this._internalArray.pop()
  }

  async shift () {
    await this._waitForContent()
    let payload = this._internalArray.shift()
    return payload
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
