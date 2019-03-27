const EventEmitter = require('./EventEmitter');
const Resolvable = require('./Resolvable')

let nextId = 0

module.exports = class Klazz {
  constructor () {
    this._arguments = arguments
    this._id = nextId++
    this._internalEvents = new EventEmitter()

    this._readyResolvable = new Resolvable()
    this._destroyedResolvable = new Resolvable()

    this._internalEvents.on('ready', this._readyResolvable.resolve)
    this._internalEvents.on('destroyed', this._destroyedResolvable.resolve)

    this._initialize.apply(this, arguments)
  }

  async _initialize (isReady = true) {
    if (isReady) this.ready()
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



  isActive () {
    return !this._destroyedResolvable.didComplete()
  }

  isReady () {
    return this._readyResolvable.didComplete()
  }

  async untilReady () {
    let result = await this._readyResolvable
    return result
  }

  async untilDestroyed () {
    let result = await this._destroyedResolvable
    return result
  }
}
