const AsyncArray = require('./AsyncArray')

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, taskData) {
    this._getTaskList(taskName).push(taskData)
  }

  async consume(taskName) {
    const taskData = await this._getTaskList(taskName).consume()
    return taskData
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}