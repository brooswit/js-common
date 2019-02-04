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
      while(routine.isActive) {
        let consumeRoutine = this._consume(taskName, subscriptionHandler, routine)
        await consumeRoutine.untilEnd
      }
    }, parentRoutine, `task.subscribe.${taskName}`)
  }

  _consume(taskName, taskHandler, parentRoutine) {
    return new Routine(async (routine) => {
      console.log('consuming ' + taskName)
      let {payload, responseHandler} = (await this._getTaskList(taskName)).shift()
      console.log('got ' + taskName)
      if (!routine.isActive) { return }
      console.log('running ' + taskName)
      let taskResult = await taskHandler(payload)
      console.log('result ' + taskName)
      if (!routine.isActive) { return }

      console.log('handling ' + taskName)
      if (responseHandler) { responseHandler(taskResult) }
      console.log('handled ' + taskName)
    }, parentRoutine)
  }

  _getTaskList(taskName) {
      return this._asyncArrays[taskName] = this._asyncArrays[taskName] || new AsyncArray(this)
  }
}
