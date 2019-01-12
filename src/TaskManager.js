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
      console.log('consume start', taskName, process.closed)
      process.promiseToClose.then(()=>{console.log('consume closed', taskName, process.closed)})
      let {payload, responseHandler, responseContext} = await this._getTaskList(taskName).shift()
      console.log('consume got it', taskName, process.closed)
      if (process.closed) return
      let taskResult = await taskHandler.call(taskContext, payload)
      console.log('consume doin it', taskName, process.closed, responseHandler)
      if (process.closed) return

      if (responseHandler) {
        await responseHandler.call(responseContext, taskResult)
      } else {
        console.log('consume no_response_handler', taskName, process.closed)
      }
      console.log('consume done', taskName, process.closed)
    }, parentProcess)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
