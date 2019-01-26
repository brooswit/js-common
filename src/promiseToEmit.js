module.exports = function promiseToEmit(emitter, resolveEventName, rejectEventName) {
    return new Promise((resolve, reject) => {
        emitter.on(resolveEventName, resolver)
        if (rejectEventName) {
            emitter.on(rejectEventName, rejecter)
        }
      
        function resolver(payload, callback) {
            cleanup()
            callback(resolve(payload))
            
        }

        function rejecter(error) {
            cleanup()
            callback(reject(error))
        }

        function cleanup() {
            emitter.off(resolveEventName, resolver)
            if (rejectEventName) {
                emitter.off(rejectEventName, rejecter)
            }
        }
    })
}
