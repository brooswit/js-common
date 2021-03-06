const run = require('../functions/run')
const NO_OP = require('../functions/NO_OP')

module.exports = function promiseToEmit(emitter, resolveEventName, rejectEventName) {
    return new Promise((resolve, reject) => {
        emitter.on(resolveEventName, resolver)
        if (rejectEventName) {
            emitter.on(rejectEventName, rejecter)
        }
      
        function resolver(payload, callback=NO_OP) {
            run(async () =>{
                cleanup()
                callback(await resolve(payload))
            })
        }

        function rejecter(error) {
            cleanup()
            reject(error)
        }

        function cleanup() {
            emitter.off(resolveEventName, resolver)
            if (rejectEventName) {
                emitter.off(rejectEventName, rejecter)
            }
        }
    })
}
