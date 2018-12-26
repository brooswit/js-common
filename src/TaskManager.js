const AsyncArray = require('./AsyncArray')

class Process  {
  constructor(process) {
    this.active = true
    process(this)
  }

  close() {
    this.active = false
  }
}

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, payload) {
    this._getTaskList(taskName).push({payload})
  }

  request(taskName, payload, responseHandler, responseContext) {
    this._getTaskList(taskName).push({payload, responseHandler, responseContext})
  }

  consume(taskName, taskHandler, taskContext) {
    this._consume(taskName, taskHandler, taskContext)
  }

  subscribe(taskName, subscriptionHandler, context) {
    return new Process(async function(process) {
      while(process.active) {
        await this._consume(taskName, subscriptionHandler, context)
      }
    })
  }

  async _consume(taskName, taskHandler, taskContext) {
    let {payload, responseHandler, responseContext} = await this._getTaskList(taskName).shift()
    if (payload) {
      let taskResult = taskHandler.call(taskContext, payload)
      if (responseHandler) {
        await responseHandler.call(responseContext, taskResult)
      }
      return true
    }
    return false
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}