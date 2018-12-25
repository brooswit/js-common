const AsyncArray = require('./AsyncArray')
const Resolver = require('./Resolver')

class Task {
  constructor(taskData) {
    this.promise = new Resolver()
    this.payload = taskData
  }
}

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feedTask(taskName, payload) {
    this._taskManager.feed(taskName, payload)
  }

  requestTask(taskName, payload, responseHandler, context) {
      this._taskManager.request(taskName, payload, responseHandler, context)
  }

  consumeTask(taskName, taskHandler, context) {
      this._taskManager.consume(taskName, taskHandler, context)
  }

  subscribeTask(taskName, subscriptionHandler, context) {
      this._taskManager.subscribe(taskName, subscriptionHandler, context)
  }
  async request(taskName, payload) {
    return await this._taskManager.request(taskName, payload)
  }

  feed(taskName, payload) {
    return this._taskManager.feed(taskName, payload)
  }

  async consume(taskName) {
    return await this._taskManager.consume(taskName)
  }

  subscribe(taskName, callback, context) {
    this._taskManager.subscribe(taskName, callback, context)
  }

  feed(taskName, taskData) {
    this.request(taskName, taskData)
  }

  async request(taskName, taskData) {
    const task = new Task(taskData)
    this._getTaskList(taskName).push(task)
    const result = await task.promise
    return result
  }

  async consume(taskName) {
    const taskList = this._getTaskList(taskName)
    const task = await taskList.shift()
    task.promise.catch((e)=>{
      console.warn(e)
      this.feed(taskName, task.payload)
    })

    return task
  }

  async consumer(taskName, handler) {
    while(true) {
      const task = await this.consume(taskName)
      handler(task)
      await task.promise
    }
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}