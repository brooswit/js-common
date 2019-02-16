module.exports = class Future extends EventEmitter {
    constructor() {

    }
    async get() {
        await this.promise
    }

    set(value) {
        this.emit('set', value)
    }
}