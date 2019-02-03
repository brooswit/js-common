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

  async pop (callback) {
    const resolver = new Resolver()
    this._requestQueue.push({action: 'pop', resolver})
    this._processQueues()

    const payload = await resolver
    if (callback) { callback(payload) }
    return payload
  }

  async shift (callback) {
    return await _request('shift', callback)
  }

  async _request (action, callback) {
    const resolver = new Resolver()
    this._requestQueue.push({action, resolver})
    this._processQueues()

    const payload = await resolver
    if (callback) { callback(payload) }
    return payload}

  _processQueues() {
    while(this._requestQueue.length > 0 && (!this.isActive || this._payloadQueue > 0) ) {
      const {action, resolver} = this._requestQueue.shift()
      resolver.resolve(this._payloadQueue[action]())
    }
  }
}

module.exports = AsyncArray
