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
    console.log('feed (request)')
    const task = new Task(taskData)
    this._getTaskList(taskName).push(task)
    console.log('waiting for task to complete')
    const result = await task
    console.log('task complete')
    return result
  }

  async consume(taskName) {
    const taskList = this._getTaskList(taskName)
    console.log('shifting...')
    let task = taskList.shift()
    console.log('shiftung', task)
    task = await task
    task.catch(()=>{
      this.feed(taskname, task.payload)
    })

    return task
  }


  async consumer(taskName, handler) {
    while(true) {
      try {
        console.log('waiting for task', taskName)
        const task = await this.consume(taskName)
        console.log('got a task')
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