module.exports = class PromiseToEmit extends Promise {
  constructor(emitter, eventName, errorEventName) {
      super((resolve, reject) => {
          emitter.once(eventName, (payload) => )
          if (errorEventName) {
              emitter.once(errorEventName, reject)
          }
          
          function resolver(payload) => {
              emitter.off(eventName, resolver)
          }
          function cleanup() => 
      })
  }
}
