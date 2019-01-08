module.exports = function promiseToEmit(emitter, eventName, errorEventName, label) {
    console.log({emitter, eventName, errorEventName, label})
    return new Promise((resolve, reject) => {
        const resolver = (payload) => {
            cleanup()
            resolve(payload)
        }

        const rejecter = (error) => {
            cleanup()
            reject(error)
        }

        emitter.on(eventName, resolver)
        if (errorEventName) {
            emitter.on(errorEventName, rejecter)
        }

        const cleanup = ()=>{
            emitter.off(eventname, resolver)
            if (errorEventName) {
                emitter.off(errorEventName, rejecter)
            }
        }
    })
}
