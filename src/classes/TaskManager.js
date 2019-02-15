const AsyncArray = require('../classes/AsyncArray')
const Routine = require('../classes/Routine')

module.exports = class TaskManager extends Routine {
  constructor () {
    super(async ()=>{
      await this.untilEnd
    })
    this._asyncArrays = {}
  }

  feed(taskName, payload) {
    const task = new Task(payload)
    return this._getTaskList(taskName).push(task)
  }

  async request(taskName, payload) {
    const task = new Task(payload)

    this._getTaskList(taskName).push(task)
    
    const result = await task.futureResult

    return result
  }

  async consume(taskName) {
    return await this._consume(taskName)
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
