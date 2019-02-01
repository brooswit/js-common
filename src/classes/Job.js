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
            this.log('hi')


            this._active = true

            this._promiseToEnd = this.promiseTo('end')

            const promiseParentWillClose = optionalParent && optionalParent.untilEnd
            const promiseThisWillEnd = this.untilEnd
            const promiseThisWillComplete = async () => {
                await chrono.delay()
                return await mainHandler(this)
            }

            const allPromises = [promiseThisWillEnd, promiseThisWillComplete]
            if (optionalParent) { allPromises.push(promiseParentWillClose) }

            await Promise.race(allPromises)

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
