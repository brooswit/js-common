const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

class Task extends Future {
  constructor(payload) {
    for(key in payload) {
      this[key] = this[key] || payload[key]
    }
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
    let task = new Task()
    this._getTaskList(taskName).push(task)
    task.set(undefined)
  }

  async request(taskName, payload) {
    if (!this.isActive) return null
    let task = new Task()
    this._getTaskList(taskName).push(task)
    return await task.get()
  }

  async consume(taskName) {
    if (!this.isActive) return undefined
    this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    return await this._asyncArrays[taskName].shift()
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        const task = await this.consume(taskName)
        subscriptionHandler(await this.consume(taskName))
        await task.get()
      }
    }, this, `${taskName} Subscription`)
  }
}
