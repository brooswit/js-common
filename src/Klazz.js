const EventEmitter = require('events')
const Resolver = require('./Resolver')

let nextId = 0

module.exports = class Klazz {
  constructor () {
    this._arguments = arguments
    this._id = nextId++
    this._internalEvents = new EventEmitter()

    this._readyPromise = new Resolver()
    this._destroyedPromise = new Resolver()

    this._internalEvents.on('ready', this._readyPromise.resolve)
    this._internalEvents.on('destroyed', this._destroyedPromise.resolve)

    this.asyncConstructor.apply(arguments)
  }

  async asyncConstructor (isReady = true) {
    if (isReady) this.ready()
  }

  isActive () {
    return !this._destroyedPromise.didComplete()
  }

  isReady () {
    return this._readyPromise.didComplete()
  }

  ready () {
    if (this.isReady()) return
    this._internalEvents.emit('ready')
    if (this.onReady) this.onReady()
  }

  destroy () {
    if (!this.isActive()) return
    this._internalEvents.emit('destroyed')
    if (this.deconstructor) this.deconstructor()
  }

  async untilReady () {
    let result = await this._readyPromise
    return result
  }

  async untilDestroyed () {
    let result = await this._destroyedPromise
    return result
  }
}
