const Resolvable = require('./Resolvable')

class AsyncArray {
  constructor () {
    this.isStopped = false
    this._requestQueue = []
    this._elementQueue = []
  }

  push (element) {
    return this._put('push', element)
  }

  unshift (element) {
    return this._put('unshift', element)
  }

  async pop () {
    return await this._get('pop')
  }

  async shift () {
    return await this._get('shift')
  }

  stop() {
    this.isStopped = true
  }

  _put (action, element) {
    if(this.isStopped) return null
    this._elementQueue[action](element)
    this._processQueues()
    return element
  }

  async _get (action) {
    const resolver = new Resolvable()
    this._requestQueue.push({ action, resolver })
    this._processQueues()
    return await resolver
  }

  _processQueues() {
    while(this._requestQueue.length > 0 && (this.isStopped || this._elementQueue.length > 0) ) {
      const {action, resolver} = this._requestQueue.shift()
      const element = this._elementQueue[action]()
      resolver.resolve(element)
    }
  }
}

module.exports = AsyncArray
