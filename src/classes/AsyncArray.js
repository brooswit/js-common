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
    return this._put('push', payload)
  }

  unshift (payload) {
    return this._put('unshift', payload)
  }

  async pop (callback) {
    return await this._take('pop', callback)
  }

  async shift (callback) {
    return await this._take('shift', callback)
  }

  _put (action, payload) {
    if(!this.isActive) return false
    this._payloadQueue[action](payload)
    this._processQueues()
    return true
  }

  async _take (action, callback) {
    this.log.info(action)
    const resolver = new Resolver()
    this._requestQueue.push({ action, resolver })
    this._processQueues()

    const payload = await resolver
    if (callback) {
      callback(payload)
    }
    return payload
  }

  _processQueues() {
    while(this._requestQueue.length > 0 && (!this.isActive || this._payloadQueue > 0) ) {
      const {action, resolver} = this._requestQueue.shift()
      resolver.resolve(this._payloadQueue[action]())
    }
  }
}

module.exports = AsyncArray
