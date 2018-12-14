const AsyncArray = require('./AsyncArray')
const Resolver = require('./Resolver')

class Task extends Resolver {
  constructor(taskData) {
    super()
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
    const task = new Task(taskData)
    this._getTaskList(taskName).push(task)
    const result = await task
    return result
  }

  async consume(taskName) {
    const taskList = this._getTaskList(taskName)
    const task = await taskList.shift()
    
    task.catch(()=>{
      this.feed(taskname, task.payload)
    })

    return task
  }


  async consumer(taskName, handler) {
    while(true) {
      try {
        const task = await this.consume(taskName)
        await handler(task)
      } catch(e) {
        console.warn(e)
      }
    }
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}