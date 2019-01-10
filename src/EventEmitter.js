module.exports = class EventEmitter extends Process {
    constructor() {
        super(()=>{
            await this.promiseToClose
        })
    }
    on(eventName, callback, context) {

    }
    off(eventName, callback, context)
    emit(eventName, payload)

}