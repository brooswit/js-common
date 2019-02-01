const winston = require('winston')

class Church {
    constructor(namespace) {
        this._namespace = namespace
    }

    create(namespace) {
        return new Church(`${this.namespace}:${namespace}`)
    }

    get level() {
        return winston.level
    }

    set level(value) {
        winston.level = value
    }

    log() {
        winston.log.apply(arguments)
    }
}

module.exports = church = new Church(':')
