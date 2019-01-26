module.exports = function promiseToEmit(emitter, eventName, errorEventName) {
    return new Promise((resolve, reject) => {
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
            emitter.off(eventName, resolver)
            if (errorEventName) {
                emitter.off(errorEventName, rejecter)
            }
        }
    })
}
