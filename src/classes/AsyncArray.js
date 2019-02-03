const Resolver = require('../classes/Resolver')
const Routine = require('../classes/Routine')

class AsyncArray extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._callbackQueue = []
    this._payloadQueue = []
  }

  push (payload) {
    if(!this.isActive) return
    this._payloadQueue.push(payload)
    this._resolveRequest()
  }

  unshift (payload) {
    if(!this.isActive) return
    this._payloadQueue.unshift(payload)
    this._resolveRequest()
  }

  pop (callback) {
    this._callbackQueue.push({action: 'pop', callback})
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
