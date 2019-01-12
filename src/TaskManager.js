const AsyncArray = require('./AsyncArray')
const Process = require('./Process')

module.exports = class TaskManager {
  constructor () {
    this._taskLists = {}
  }

  feed(taskName, payload) {
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
      console.log(taskName, 'started')
      let taskData = {
        closed: false,
        payload, responseHandler, responseContext
      }

      this._getTaskList(taskName).push(taskData)

      await process.promiseToClose
      console.log(taskName, 'closed')
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
        console.log('subscription ready', taskName, process.closed)
      }
      console.log('subscription end ', taskName, process.closed)
    })
  }

  _consume(taskName, taskHandler, taskContext, parentProcess) {
    return new Process(async (process) => {
      console.log('consume waiting for task', taskName, process.closed)
      let {payload, responseHandler, responseContext} = await this._getTaskList(taskName).shift()
      console.log('consume got a task', taskName, process.closed, payload, responseHandler, responseContext)
      if (process.closed) return
      console.log('consume doing task', taskName, process.closed)
      let taskResult = await taskHandler.call(taskContext, payload)
      console.log('consume task complete', taskName, process.closed)
      if (process.closed) return

      if (responseHandler) {
        console.log('consume doing response handler', taskName, process.closed)
        try {
          await responseHandler.call(responseContext, taskResult)
        } catch(e) {
          console.log(e)
          console.log(e)
          console.log(e)
          console.log(e)
          console.log(e)
          console.log(e)
          console.log(e)
        }
        console.log('response handler complete', taskName, process.closed)
      } else {
        console.log('consume no_response_handler', taskName, process.closed)
      }
      console.log('consume done', taskName, process.closed)
    }, undefined, parentProcess)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
