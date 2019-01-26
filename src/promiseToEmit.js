module.exports = function promiseToEmit(emitter, eventName, rejectEventName) {
    return new Promise((resolve, reject) => {
        emitter.on(eventName, resolver)
        if (rejectEventName) {
            emitter.on(rejectEventName, rejecter)
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
            if (rejectEventName) {
                emitter.off(rejectEventName, rejecter)
            }
        }
    })
}
