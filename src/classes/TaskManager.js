const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')
const Future = require('../classes/Future')

class Task {
  constructor(taskData) {
    this._taskFuture = new Future()
    this._taskData = taskData
    this._handlerPromise = null
  }
  
  async getData() {
    return this._taskData
  }
  
  async tilResult() {
    await this.result()
    return
  }
  
  async getResult() {
    return await this._taskFuture.get()
  }
  
  async run(handler) {
    if (this._handlerPromise !== null) return
    this._handlerPromise = handler(this._taskData)
    this.resolve(await this._handlerPromise)
  }
  
  resolve(value) {
    if (this._taskFuture.isSet === true) return
    this._taskFuture.set(value)
  }
  
  cancel() {
    if (this._taskFuture.isSet === true) return
    this._taskFuture.set(null)
  }
}

module.exports = class TaskManager {
  constructor () {
    this._taskQueues = {}
  }

  feed(taskQueueName, taskData) {
    const task = new Task(taskData)
    task.resolve()
    this._ensureTaskQueue(taskQueueName).push(task)
    return task
  }

  async request(taskQueueName, taskData) {
    const task = new Task(taskData)
    this._ensureTaskQueue(taskQueueName).push(task)
    return await task.getResult()
  }

  async consume(taskQueueName) {
    const task = await this._ensureTaskQueue(taskQueueName).shift()
    return task
  }

  subscribe(taskQueueName, subscriptionHandler) {
    return new Routine(async (routine) => {
      routine.log.silly('ALIVE')
      while(routine.isActive) {
        routine.log.silly('waiting')
        const task = await this.consume(taskQueueName)
        routine.log.silly('running')
        task.run(subscriptionHandler)
        await task.getResult()
        routine.log.silly('result')
      }
      routine.log.silly('DEAD')
    }, null, `${taskQueueName} Subscription`)
  }

  _ensureTaskQueue(taskQueueName) {
    return this._taskQueues[taskQueueName] = this._taskQueues[taskQueueName] || new AsyncArray(this, taskQueueName)
  }
}
