const winston = require('winston')
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
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
        let args = Array.prototype.slice.call(arguments)
        args.splice(1, 0, this._namespace);
        logger.log.apply(logger, args)
    }
}

module.exports = church = new Church(':')
