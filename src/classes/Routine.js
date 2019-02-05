const createLogger = require('winston-namespace')
const chalk = require('chalk')

const run = require('../functions/run')
const ExtendedEmitter = require('../classes/ExtendedEmitter')
const chrono = require('../services/chrono')

function randomElement(arr) {
    return Math.floor(Math.random() * arr.length)
}

function randomChalk(str) {
    // styles = ['bold', 'dim', 'italic']
    const color = randomElement(['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'])
    console.log(color)
    str = chalk[color](str)
    if (Math.random()<0.5) { str = chalk.bold(str) }
    if (Math.random()<0.5) { str = chalk.dim(str) }
    if (Math.random()<0.5) { str = chalk.italic(str) }
    return str
}

module.exports = class Routine extends ExtendedEmitter {
    constructor(mainHandlers, optionalParent, optionalName) {
        super()
        run(async () => {
            mainHandlers = Array.isArray(mainHandlers) ? mainHandlers : [mainHandlers]
            this.log = createLogger(randomChalk(optionalName ? `${this.constructor.name}:${optionalName}` : this.constructor.name))
            this._active = true

            this._promiseToEnd = this.promiseTo('end')

            const allPromises = []
            allPromises.push(this.untilEnd)
            if (optionalParent) {
                allPromises.push(optionalParent.untilEnd)
            }
            
            await chrono.delay()

            for (let handlerIndex in mainHandlers) {
                const handler = mainHandlers[handlerIndex]
                allPromises.push(handler(this))
            }

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
        new Routine(async (routine) => {
            await routine.untilEnd
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
