const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

module.exports = class TaskManager extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._asyncArrays = {}
  }

  feed(taskName, payload, parentRoutine) {
    return new Routine(async (routine) => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    }, parentRoutine, `task.feed.${taskName}`)
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
    }, parentRoutine, `task.request.${taskName}`)
  }

  consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      this._consume(taskName, taskHandler, routine)
    }, parentRoutine, `task.consume.${taskName}`)
  }

  subscribe(taskName, subscriptionHandler, parentRoutine) {
    return new Routine(async (routine) => {
      while(routine.isActive) {
        let consumeRoutine = this._consume(taskName, subscriptionHandler, routine)
        await consumeRoutine.untilEnd
      }
    }, parentRoutine, `task.subscribe.${taskName}`)
  }

  _consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      const taskList = this._getTaskList(taskName)
      let {payload, responseHandler} = await taskList.shift()
      if (!routine.isActive) { return }
      let taskResult = await taskHandler(payload)
      if (!routine.isActive) { return }
      if (responseHandler) { responseHandler(taskResult) }
    }, parentRoutine)
  }

  _getTaskList(taskName) {
      return this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this, taskName)
  }
}
