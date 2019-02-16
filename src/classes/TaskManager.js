const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

module.exports = class TaskManager extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._asyncArrays = {}
  }

  feed(taskName, payload) {
    if (!this.isActive) return
    let future = new Future()
    this._getTaskList(taskName).push({future, payload})
    future.set(undefined)
  }

  async request(taskName, payload) {
    if (!this.isActive) return null
    let future = new Future()

    this._getTaskList(taskName).push({future, payload})

    return await future.get()
  }

  async consume(taskName) {
    if (!this.isActive) return undefined
    this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    return await this._asyncArrays[taskName].shift()
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        subscriptionHandler(await this.consume(taskName))
      }
    }, this, `${taskName} Subscription`)
  }
}
