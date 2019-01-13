const AsyncArray = require('./AsyncArray')
const Process = require('./Process')

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, payload, parentProcess) {
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    }, parentProcess)
  }

  request(taskName, payload, responseHandler, responseContext, parentProcess) {
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload, responseHandler, responseContext
      }

      this._getTaskList(taskName).push(taskData)

      await process.promiseToClose
      taskData.closed = true
    }, parentProcess)
  }

  consume(taskName, taskHandler, taskContext, parentProcess) {
    return new Process(async (process) => {
      this._consume(taskName, taskHandler, taskContext, process)
    }, parentProcess)
  }

  subscribe(taskName, subscriptionHandler, context, parentProcess) {
    return new Process(async (process) => {
      while(process.active) {
        let consumeProcess = this._consume(taskName, subscriptionHandler, context, process)
        await consumeProcess.promiseToClose
      }
    }, parentProcess)
  }

  _consume(taskName, taskHandler, taskContext, parentProcess) {
    return new Process(async (process) => {
      let {payload, responseHandler, responseContext} = await this._getTaskList(taskName).shift()
      if (process.closed) return
      let taskResult = await taskHandler.call(taskContext, payload)
      if (process.closed) return

      if (responseHandler) {
        responseHandler.call(responseContext, taskResult)
      } else {
      }
    }, undefined, parentProcess)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
