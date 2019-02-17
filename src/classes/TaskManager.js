const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')
const Future = require('../classes/Future')

class Task {
  constructor(data) {
    this._future = new Future()
    this._data = data
  }

  async getData() {
    return this._data
  }

  async tilResult() {
    await this.result()
    return
  }

  async getResult() {
    return await this._future.get()
  }

  async run(handler) {
    if (this._future.isSet === true) return
    this.resolve(await handler(this._data))
  }

  resolve(value) {
    if (this._future.isSet === true) return
    this._future.set(value)
  }

  cancel() {
    if (this._future.isSet === true) return
    this._future.set(null)
  }
}

module.exports = class TaskManager extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._taskQueues = {}
  }

  feed(taskName, data) {
    if (!this.isActive) return
    const task = new Task(data)
    this._ensureTaskQueue(taskName).push(task)
    task.cancel(undefined)
    return task
  }

  async request(taskName, data) {
    if (!this.isActive) return null
    const task = new Task(data)
    this._ensureTaskQueue(taskName).push(task)
    return await task.getResult()
  }

  async consume(taskName) {
    if (!this.isActive) return undefined
    const task = await this._ensureTaskQueue(taskName).shift()
    return task
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        const task = await this.consume(taskName)
        task.run(subscriptionHandler)
        await task.getResult()
      }
    }, this, `${taskName} Subscription`)
  }

  _ensureTaskQueue(taskName) {
    return this._taskQueues[taskName] = this._taskQueues[taskName] || new AsyncArray(this, taskName)
  }
}
