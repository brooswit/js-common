module.exports = function promiseToEmit(emitter, eventName, errorEventName, label) {
    console.log({emitter, eventName, errorEventName, label})
    return new Promise((resolve, reject) => {
        let resolver, rejecter, cleanup

        resolver = (payload) => {
            cleanup()
            resolve(payload)
        }

        rejecter = (error) => {
            cleanup()
            reject(error)
        }
        
        cleanup = () => {
            emitter.off(eventname, resolver)
            if (errorEventName) {
                emitter.off(errorEventName, rejecter)
            }
        }

        emitter.on(eventName, resolver)
        if (errorEventName) {
            emitter.on(errorEventName, rejecter)
        }
    })
}
