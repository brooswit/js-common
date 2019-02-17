const ExtendedEmitter = require('./ExtendedEmitter')

module.exports = class Future extends ExtendedEmitter {
    constructor() {
        super()
        this.untilSet = this.promiseTo('set')
        this.on('set', ()=>{
            this.untilSet = this.promiseTo('set')
        })
    }

    async get() {
        return await this.untilSet
    }

    set(value) {
        this.emit('set', value)
    }
}
