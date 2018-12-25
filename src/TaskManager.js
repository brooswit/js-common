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

  feed(taskName, payload) {
    this._getTaskList(taskName).push(payload)
  }

  request(taskName, payload, responseHandler, context) {
    await new Promise((resolve)=>{
      this._getTaskList(taskName).push(()=>{
        resolve()
        return payload
      })
    })
    const task = new Task(taskData)
    this._getTaskList(taskName).push(task)
    const result = await task.promise
    return result
      this._taskManager.request(taskName, payload, responseHandler, context)
  }

  consume(taskName, taskHandler, taskContext) {
    let {payload, callback, context} = await this._getTaskList(taskName).shift()
    taskHandler.call(taskContext, payload)
  }

  subscribe(taskName, subscriptionHandler, context) {
      this._taskManager.subscribe(taskName, subscriptionHandler, context)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
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