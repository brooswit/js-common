const Resolver = require('../classes/Resolver')
const Routine = require('../classes/Routine')

class AsyncArray extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._actionQueue = []
    this._payloadQueue = []
  }

  push (payload) {
    if(!this.isActive) return
    this._payloadQueue.push(payload)
  }

  unshift (payload) {
    if(!this.isActive) return
    this._payloadQueue.unshift(payload)
  }

  pop (callback) {
    if(!this.isActive) return
    this._actionQueue.push({action: 'pop', callback})
  }

  shift () {
    if(!this.isActive) return
    this._actionQueue.push({action: 'shift', callback})
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
