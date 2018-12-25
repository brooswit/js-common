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
    this._getTaskList(taskName).push({payload})
  }

  request(taskName, payload, responseHandler, responseContext) {
    this._getTaskList(taskName).push({payload, responseHandler, responseContext})
  }

  consume(taskName, taskHandler, taskContext) {
    this._consume(taskName, taskHandler, taskContext)
  }

  subscribe(taskName, subscriptionHandler, context) {
    this._subscribe(taskName, subscriptionHandler, context)
  }

  async _consume(taskName, taskHandler, taskContext) {
    let {payload, responseHandler, responseContext} = await this._getTaskList(taskName).shift()
    if (payload) {
      let taskResult = taskHandler.call(taskContext, payload)
      if (responseHandler) {
        responseHandler.call(responseContext, taskResult)
      }
      return true
    }
    return false
  }

  async _subscribe(taskName, subscriptionHandler, context) {
    while(await _consume(taskName, subscriptionHandler, context)) {}
  }


  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}