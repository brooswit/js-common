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
    this._getTaskList(taskName).push(payload)
  }

  async request(taskName, payload) {
    if (!this.isActive) return null
    payload.future = new Future()

    this._getTaskList(taskName).push(payload)
    
    const result = await payload.resolver

    return result
  }

  async consume(taskName) {
    if (!this.isActive) return undefined
    const taskList = this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    return await taskList.shift()
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        subscriptionHandler(await this.consume(taskName))
      }
    }, this, `${taskName} Subscription`)
  }
}
