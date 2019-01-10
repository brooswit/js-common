const AsyncArray = require('./AsyncArray')
const Process = require('./Process')

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, payload) {
    // NOTE: SHOULD NOT HONOR PROCESS CLOSURE
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    })
  }

  request(taskName, payload, responseHandler, responseContext) {
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload, responseHandler, responseContext
      }

      console.log('pushing task')
      this._getTaskList(taskName).push(taskData)

      await process.promiseToClose
      taskData.closed = true
    })
  }

  consume(taskName, taskHandler, taskContext) {
    return new Process(async (process) => {
      this._consume(taskName, taskHandler, taskContext, process)
    })
  }

  subscribe(taskName, subscriptionHandler, context) {
    return new Process(async (process) => {
      while(process.active) {
        let consumeProcess = this._consume(taskName, subscriptionHandler, context, process)
        await consumeProcess.promiseToClose
      }
    })
  }

  _consume(taskName, taskHandler, taskContext, parentProcess) {
    return new Process(async (process) => {
        let {payload, responseHandler, responseContext} = await this._getTaskList(taskName).shift()
        if (process.closed) return
        console.log('consumed a thing')
        let taskResult = await taskHandler.call(taskContext, payload)
        if (process.closed) return

        if (responseHandler) {
          await responseHandler.call(responseContext, taskResult)
        console.log('responded')
      }
    }, parentProcess)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
