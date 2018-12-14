const AsyncArray = require('./AsyncArray')
const Resolver = require('./Resolver')

class Task {
  constructor(taskData) {
    super()
    this.promise = new Resolver()
    this.payload = taskData
  }
}

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, taskData) {
    this.request(taskName, taskData)
  }

  async request(taskName, taskData) {
    console.log('feed (request)')
    const task = new Task(taskData)
    this._getTaskList(taskName).push(task)
    console.log('waiting for task to complete')
    const result = await task.promise
    console.log('task complete')
    return result
  }

  async consume(taskName) {
    const taskList = this._getTaskList(taskName)
    console.log('shifting...')
    const task = await taskList.shift()
    console.log('shifted')
    task.promise.catch(()=>{
      this.feed(taskname, task.payload)
    })

    return task
  }


  async consumer(taskName, handler) {
    while(true) {
      console.log('waiting for task', taskName)
      const task = await this.consume(taskName)
      console.log('got a task')
      handler(task)
      await task.promise
    }
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}