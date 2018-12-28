module.exports = class PromiseToEmit extends Promise {
  constructor(emitter, eventName, errorEventName) {
      super((resolve, reject) => {
          emitter.once(eventName, (payload) => )
          if (errorEventName) {
              emitter.once(errorEventName, reject)
          }
          
        function resolver(payload) => {
            
            resolve(payload()
            emitter.off(eventName, resolver)
        }

        function rejecter(payload) => {
            emitter.off(eventName, resolver)
        }
          function cleanup() {
              emitter.off(eventname, resolver)
              emitter.off(errorEventName, rejecter)
          }
      })
  }
}
