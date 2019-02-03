const Resolver = require('../classes/Resolver')
const Routine = require('../classes/Routine')

class AsyncArray extends Routine {
  constructor (optionalParent) {
    super(async ()=>{
      await this.untilEnd
    }, optionalParent)
    this._requestQueue = []
    this._payloadQueue = []
  }

  push (payload) {
    if(!this.isActive) return
    this._payloadQueue.push(payload)
    this._processQueues()
  }

  unshift (payload) {
    if(!this.isActive) return
    this._payloadQueue.unshift(payload)
    this._processQueues()
  }

  pop (callback) {
    if(!this.isActive) return
    this._requestQueue.push({action: 'pop', callback})
    this._processQueues()
  }

  shift () {
    if(!this.isActive) return
    this._requestQueue.push({action: 'shift', callback})
    this._processQueues()
  }

  _processQueues() {
    while(this._requestQueue.length > 0 && (!this.isActive || this._payloadQueue > 0) ) {
      const {action, callback} = this._requestQueue.shift()
      callback(this._payloadQueue[action]())
    }
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
