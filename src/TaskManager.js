const AsyncArray = require('./AsyncArray')
const Process = require('./Process')

module.exports = class TaskManager {
  constructor (optionalData = {}) {
    this._taskLists = optionalData
  }

  feed(taskName, payload, parentProcess) {
    return new Process(async () => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    }, parentProcess)
  }

  request(taskName, payload, responseHandler, parentProcess) {
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload, responseHandler
      }

      this._getTaskList(taskName).push(taskData)

      await process.untilEnd
      taskData.closed = true
    }, parentProcess)
  }

  consume(taskName, taskHandler, parentProcess) {
    return new Process(async (process) => {
      this._consume(taskName, taskHandler, process)
    }, parentProcess)
  }

  subscribe(taskName, subscriptionHandler, parentProcess) {
    return new Process(async (process) => {
      while(process.active) {
        let consumeProcess = this._consume(taskName, subscriptionHandler, process)
        await consumeProcess.untilEnd
      }
    }, parentProcess)
  }

  _consume(taskName, taskHandler, parentProcess) {
    return new Process(async (process) => {
      let {payload, responseHandler} = await this._getTaskList(taskName).shift()
      if (process.closed) { return }
      let taskResult = await taskHandler(payload)
      if (process.closed) { return }

      if (responseHandler) { responseHandler(taskResult) }
    }, parentProcess)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
