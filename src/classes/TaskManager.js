const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')
const Future = require('../classes/Future')

class Task {
  constructor(data) {
    this.future = new Future()
    this.data = data
  }

  async run(handler) {
    this.end(await this.handler(data))
  }
}

module.exports = class TaskManager extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._asyncArrays = {}
  }

  feed(taskName, data) {
    if (!this.isActive) return
    const task = new Task(data)
    this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
    this._asyncArrays[taskName].push(task)
    task.set(undefined)
    return task
  }

  async request(taskName, data) {
    if (!this.isActive) return null
    const task = new Task(data)
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
        task.run(subscriptionHandler)
        await task.get()
      }
    }, this, `${taskName} Subscription`)
  }
}
