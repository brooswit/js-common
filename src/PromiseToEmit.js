module.exports = function promiseToEmit(emitter, eventName, errorEventName, label) {
    console.debug('PROMISE TO EMIT ' + eventName + " for " + label)
    let resolver
}
class PromiseToEmit extends Promise {
  constructor(emitter, eventName, errorEventName, label) {

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
