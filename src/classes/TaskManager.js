const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')
const Future = require('../classes/Future')

class Task {
  constructor(taskData) {
    this._future = new Future()
    this._taskData = taskData
    this._promise = null
  }
  
  async getData() {
    return this._taskData
  }
  
  async tilResult() {
    await this.result()
    return
  }
  
  async getResult() {
    return await this._future.get()
  }
  
  async run(handler) {
    if (this._promise !== null) return
    this._promise = handler(this._taskData)
    this.resolve(await this._promise)
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

  feed(taskQueueName, taskData) {
    if (!this.isActive) return
    const task = new Task(taskData)
    task.resolve()
    this._ensureTaskQueue(taskQueueName).push(task)
    return task
  }

  async request(taskQueueName, taskData) {
    if (!this.isActive) return null
    const task = new Task(taskData)
    this._ensureTaskQueue(taskQueueName).push(task)
    return await task.getResult()
  }

  async consume(taskQueueName) {
    if (!this.isActive) return undefined
    const task = await this._ensureTaskQueue(taskQueueName).shift()
    return task
  }

  subscribe(taskQueueName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        const task = await this.consume(taskQueueName)
        task.run(subscriptionHandler)
        await task.getResult()
      }
    }, this, `${taskQueueName} Subscription`)
  }

  _ensureTaskQueue(taskQueueName) {
    return this._taskQueues[taskQueueName] = this._taskQueues[taskQueueName] || new AsyncArray(this, taskQueueName)
  }
}
