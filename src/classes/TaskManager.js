const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

module.exports = class TaskManager {
  constructor (optionalData = {}) {
    this._taskLists = optionalData
  }

  feed(taskName, payload, parentRoutine) {
    return new Routine(async () => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    }, parentRoutine)
  }

  request(taskName, payload, responseHandler, parentRoutine) {
    return new Routine(async (routine) => {
      let taskData = {
        closed: false,
        payload, responseHandler
      }

      this._getTaskList(taskName).push(taskData)

      await routine.untilEnd
      taskData.closed = true
    }, parentRoutine)
  }

  consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      this._consume(taskName, taskHandler, routine)
    }, parentRoutine)
  }

  subscribe(taskName, subscriptionHandler, parentRoutine) {
    return new Routine(async (routine) => {
      while(routine.active) {
        let consumeRoutine = this._consume(taskName, subscriptionHandler, routine)
        await consumeRoutine.untilEnd
      }
    }, parentRoutine)
  }

  _consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      let {payload, responseHandler} = await this._getTaskList(taskName).shift()
      if (routine.closed) { return }
      let taskResult = await taskHandler(payload)
      if (routine.closed) { return }

      if (responseHandler) { responseHandler(taskResult) }
    }, parentRoutine)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
