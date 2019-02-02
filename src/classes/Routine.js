const createLogger = require('winston-namespace')
const run = require('../functions/run')
const ExtendedEmitter = require('../classes/ExtendedEmitter')
const chrono = require('../services/chrono')

module.exports = class Routine extends ExtendedEmitter {
    constructor(mainHandler, optionalParent, optionalName) {
        super()
        run(async () => {
            this.log = createLogger(optionalName || this.constructor.name)
            this._active = true

            this._promiseToEnd = this.promiseTo('end')

            const promiseParentWillClose = optionalParent && optionalParent.untilEnd
            const promiseThisWillEnd = this.untilEnd
            const promiseThisWillComplete = run(async () => {
                this.log.silly('waiting for construction to complete...')
                await chrono.delay()
                this.log.silly('...construction complete!')
                this.log.silly('starting main handler...')
                const result = await mainHandler(this)
                this.log.silly('...main handler!')
                return result
            })

            const allPromises = [promiseThisWillEnd, promiseThisWillComplete]
            if (optionalParent) { allPromises.push(promiseParentWillClose) }

            this.log.silly('waiting for races to complete...')
            await Promise.race(allPromises)
            this.log.silly('...races complete!')

            this.end()
        })
    }

    get untilEnd() {
        return this._promiseToEnd
    }

    get isActive() {
        return !!this._active
    }

    subscribeTo(observable, handler) {
        if (this.isActive) {
        const subscription = observable.subscribe(handler)
        new Routine(async (routine) => {
            await routine.untilEnd
            subscription.unsubscribe()
        }, this)
        return subscription
        }
    }

    end() {
        if (!this.isActive) return false
        this.log.info('end')
        this._active = false
        this.emit('end')
        return true
    }
}
