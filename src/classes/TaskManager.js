const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

module.exports = class TaskManager {
  constructor (optionalData = {}) {
    this._taskLists = optionalData
  }

  feed(taskName, payload, parentRoutine) {
    return new Routine(async (routine) => {
      routine.log.info('start')
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    }, parentRoutine, `task.feed.${taskName}`)
  }

  request(taskName, payload, responseHandler, parentRoutine) {
    return new Routine(async (routine) => {
      routine.log.info('start')
      let taskData = {
        closed: false,
        payload, responseHandler
      }

      this._getTaskList(taskName).push(taskData)
      routine.log.info('DOIN IT')

      await routine.untilEnd
      taskData.closed = true
    }, parentRoutine, `task.request.${taskName}`)
  }

  consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      routine.log.info('start')
      this._consume(taskName, taskHandler, routine)
    }, parentRoutine, `task.consume.${taskName}`)
  }

  subscribe(taskName, subscriptionHandler, parentRoutine) {
    return new Routine(async (routine) => {
      routine.log.info('start')
      while(routine.active) {
        routine.log.info('active')
        let consumeRoutine = this._consume(taskName, subscriptionHandler, routine)
        routine.log.info('active')
        await consumeRoutine.untilEnd
      }
    }, parentRoutine, `task.subscribe.${taskName}`)
  }

  _consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      console.log('consuming ' + taskName)
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
