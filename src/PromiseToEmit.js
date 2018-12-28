module.exports = class PromiseToEmit extends Promise {
  constructor(emitter, eventName, errorEventName) {
      super((resolve, reject) => {
          emitter.once(eventName, (payload) => {
          if (errorEventName) {
              emitter.once(errorEventName, reject)
          }
          
        function resolver(payload) {
            cleanup()
            resolve(payload)
        }

        function rejecter(error) {
            cleanup()
            reject(error)
        }
          function cleanup() {
              emitter.off(eventname, resolver)
              emitter.off(errorEventName, rejecter)
          }
      })
  }
}
