module.exports = class PromiseToEmit extends Promise {
  constructor(emitter, eventName, errorEventName) {
      super((resolve, reject) => {
            emitter.on(eventName, resolver)
            if (errorEventName) {
                emitter.on(errorEventName, rejecter)
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
                if (errorEventName) {
                    emitter.off(errorEventName, rejecter)
                }
            }
        })
    }
  }
}
