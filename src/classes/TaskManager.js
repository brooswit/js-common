const { AsyncArray, Job } = require('../common')

module.exports = class TaskManager {
  constructor (optionalData = {}) {
    this._taskLists = optionalData
  }

  feed(taskName, payload, parentJob) {
    return new Job(async () => {
      let taskData = {
        closed: false,
        payload
      }
      this._getTaskList(taskName).push(taskData)
    }, parentJob)
  }

  request(taskName, payload, responseHandler, parentJob) {
    return new Job(async (job) => {
      let taskData = {
        closed: false,
        payload, responseHandler
      }

      this._getTaskList(taskName).push(taskData)

      await job.untilEnd
      taskData.closed = true
    }, parentJob)
  }

  consume(taskName, taskHandler, parentJob) {
    return new Job(async (job) => {
      this._consume(taskName, taskHandler, job)
    }, parentJob)
  }

  subscribe(taskName, subscriptionHandler, parentJob) {
    return new Job(async (job) => {
      while(job.active) {
        let consumeJob = this._consume(taskName, subscriptionHandler, job)
        await consumeJob.untilEnd
      }
    }, parentJob)
  }

  _consume(taskName, taskHandler, parentJob) {
    return new Job(async (job) => {
      let {payload, responseHandler} = await this._getTaskList(taskName).shift()
      if (job.closed) { return }
      let taskResult = await taskHandler(payload)
      if (job.closed) { return }

      if (responseHandler) { responseHandler(taskResult) }
    }, parentJob)
  }

  _getTaskList(taskName) {
      return this._taskLists[taskName] = this._taskLists[taskName] || new AsyncArray()
  }
}
