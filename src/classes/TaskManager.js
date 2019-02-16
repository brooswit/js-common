const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

class Task {
  constructor(payload) {
    this._payload = payload
  }

  async getResult() {
    
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
    if (!this.isActive) return null
    
    const task = new Task(payload)
    
    this._getTaskList(taskName).push(task)

    return task
  }

  async request(taskName, payload) {
    if (!this.isActive) return null
    const task = new Task(payload)

    this._getTaskList(taskName).push(task)
    
    const result = await task.getResult()

    return result
  }

  consume(taskName, optionalHandler) {
    if (!this.isActive) return null
    const consumePromise = this._consume(taskName)
    if (optionalHandler) {
      consumePromise.then(optionalHandler)
    } else {
      return consumePromise
    }
  }

  subscribe(taskName, subscriptionHandler) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        subscriptionHandler(await this._consume(taskName))
      }
    }, this, `${taskName} Subscription`)
  }

  async _consume(taskName) {
    const taskList = this._getTaskList(taskName)
    const payload = await taskList.shift()
    return payload
  }

  _getTaskList(taskName) {
      return this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
  }
}
