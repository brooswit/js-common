const winston = require('winston')
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' })
    ]
})

class Church {
    constructor(namespace) {
        this._namespace = namespace
    }

    create(namespace) {
        return new Church(`${this.namespace}:${namespace}`)
    }

    get level() {
        return logger.level
    }

    set level(value) {
        logger.level = value
    }

    log() {
        logger.log.apply(logger, arguments)
    }
}

module.exports = church = new Church(':')
