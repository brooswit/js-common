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
        await this._consume(taskName, subscriptionHandler, context, process)
      }
    })
  }

  async _consume(taskName, taskHandler, taskContext, parentProcess) {
    return new Process(async (process, parentProcess) => {
      while(process.active) {
        let taskData
        do {
          taskData = await this._getTaskList(taskName).shift()
        } while (taskData.closed)
        let {payload, responseHandler, responseContext} = taskData
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
