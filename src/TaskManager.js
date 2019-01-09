const AsyncArray = require('./AsyncArray')
const Process = require('./Process')

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, payload) {
    // NOTE: SHOULD NOT HONOR PROCESS CLOSURE
    console.debug(`feeding ${taskName}`)
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    })
  }

  request(taskName, payload, responseHandler, responseContext) {
    console.debug(`requesting ${taskName}`)
    return new Process(async (process) => {
      let taskData = {
        closed: false,
        payload, responseHandler, responseContext
      }

      process.on('close', () => {
        taskData.closed = true
      })

      this._getTaskList(taskName).push(taskData)
    })
  }

  consume(taskName, taskHandler, taskContext) {
    console.debug(`consuming ${taskName}`)
    return new Process(async (process) => {
      this._consume(taskName, taskHandler, taskContext, process)
    })
  }

  subscribe(taskName, subscriptionHandler, context) {
    console.debug(`subscribing ${taskName}`)
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

        let taskResult = await taskHandler.call(taskContext, payload)
        if (process.closed) return

        if (responseHandler) {
          await responseHandler.call(responseContext, taskResult)
        }
    }, parentProcess)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
