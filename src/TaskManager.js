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

  async _consume(taskName, taskHandler, taskContext) {
  consume(taskName, taskHandler, taskContext) {
    this._consume(taskName, taskHandler, taskContext)
  }

  subscribe(taskName, subscriptionHandler, context) {
    while(consume(taskName, subscriptionHandler, context)) {}
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}