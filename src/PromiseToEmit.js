module.exports = class PromiseToEmit extends Promise {
  constructor(emitter, eventName, errorEventName) {
      super((resolve, reject) => {
          emitter.once(eventName, resolve)
          if (errorEventName) {
              emitter.once(errorEventName, reject)
          }
          function 
      })
  }
}
