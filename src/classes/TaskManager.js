const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')
const Future = require('../classes/Future')

class Task extends Future {
  constructor(payload) {
    super()
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
    const task = new Task(payload)
    this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    this._asyncArrays[taskName].push(task)
    task.set(undefined)
    return task
  }

  async request(taskName, payload) {
    if (!this.isActive) return null
    const task = new Task(payload)
    this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    this._asyncArrays[taskName].push(task)
    return await task.get()
  }

  async consume(taskName) {
    if (!this.isActive) return undefined
    this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    const task = await this._asyncArrays[taskName].shift()
    return task
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        const task = await this.consume(taskName)
        task.set(await subscriptionHandler(task))
        await task.get()
      }
    }, this, `${taskName} Subscription`)
  }
}
