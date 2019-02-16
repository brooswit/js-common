const Resolver = require('../classes/Resolver')
const Routine = require('../classes/Routine')

class AsyncArray extends Routine {
  constructor () {
    this._requestQueue = []
    this._elementQueue = []
  }

  push (element) {
    return this._put('push', element)
  }

  unshift (element) {
    return this._put('unshift', element)
  }

  async pop (callback) {
    return await this._get('pop', callback)
  }

  async shift (callback) {
    return await this._get('shift', callback)
  }

  _put (action, element) {
    if(!this.isActive) return false
    this._elementQueue[action](element)
    this._processQueues()
    return true
  }

  async _get (action, callback) {
    const resolver = new Resolver()
    this._requestQueue.push({ action, resolver })
    this._processQueues()

    const element = await resolver
    if (callback) {
      callback(element)
    }
    return element
  }

  _processQueues() {
    while(this._requestQueue.length > 0 && (!this.isActive || this._elementQueue.length > 0) ) {
      const {action, resolver} = this._requestQueue.shift()
      resolver.resolve(this._elementQueue[action]())
    }
  }
}

module.exports = AsyncArray
