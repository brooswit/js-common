module.exports = class Future extends ExtendedEmitter {
    constructor() {
        this.untilSet = this.promiseTo
    }

    async get() {
        await this.promise
    }

    set(value) {
        this.emit('set', value)
    }
}