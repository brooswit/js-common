const run = require('../functions/run')
const ExtendedEmitter = require('../classes/ExtendedEmitter')
const chrono = require('../services/chrono')
const church = require('../services/church')

module.exports = class Job extends ExtendedEmitter {
    constructor(mainHandler, optionalParent) {
        super()
        run(async () => {
            if (optionalParent) {
                this._church = optionalParent._church.create(this.constructor.name)
            } else {
                this._church = church.create(this.constructor.name)
            }
            this.log = this._church.log

            this._active = true

            this._promiseToEnd = this.promiseTo('end')

            const promiseParentWillClose = optionalParent && optionalParent.untilEnd
            const promiseThisWillEnd = this.untilEnd
            const promiseThisWillComplete = async () => {
                this.log('info', 'waiting for construction to complete...')
                await chrono.delay()
                this.log('info', '...construction complete!')
                this.log('info', 'starting main handler...')
                const result = await mainHandler(this)
                this.log('info', '...main handler!')
                return result
            }

            const allPromises = [promiseThisWillEnd, promiseThisWillComplete]
            if (optionalParent) { allPromises.push(promiseParentWillClose) }

            this.log('info', 'waiting for races to complete...')
            await Promise.race(allPromises)
            this.log('info', '...races complete!')

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
        new Job(async (job) => {
            await job.untilEnd
            subscription.unsubscribe()
        }, this)
        return subscription
        }
    }

    end() {
        if (!this.isActive) return false
        this._active = false
        this.emit('end')
        return true
    }
}
