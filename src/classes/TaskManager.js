const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

class Task {
  constructor(payload) {
    this._payload = payload
  }

  async getResult() {
    
  }
}
module.exports = class TaskManager extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._asyncArrays = {}
  }

  feed(taskName, payload) {
    if (!this.isActive) return
    this._getTaskList(taskName).push(payload)
  }

  async request(taskName, payload) {
    if (!this.isActive) return null
    payload.resolver = new Resolver()

    this._getTaskList(taskName).push(payload)
    
    const result = await payload.resolver

    return result
  }

  consume(taskName, optionalHandler) {
    if (!this.isActive) return null
    const consumePromise = this._asyncConsume(taskName)
    if (optionalHandler) {
      consumePromise.then(optionalHandler)
    } else {
      return consumePromise
    }
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        subscriptionHandler(await this.consume(taskName))
      }
    }, this, `${taskName} Subscription`)
  }

  async _asyncConsume(taskName) {
    const taskList = this._getTaskList(taskName)
    const payload = await taskList.shift()
    return payload
  }

  _getTaskList(taskName) {
      return this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
  }
}
