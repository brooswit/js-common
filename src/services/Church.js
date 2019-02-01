const winston = require('winston')()

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

    error() {
        let args = Array.prototype.slice.call(arguments)
        args.unshift('error')
        winston.log.apply(winston, args)
    }
    warn() {
        let args = Array.prototype.slice.call(arguments)
        args.unshift('warn')
        winston.log.apply(winston, args)
    }
    info() {
        let args = Array.prototype.slice.call(arguments)
        args.unshift('info')
        winston.log.apply(winston, args)
    }
    verbose() {
        let args = Array.prototype.slice.call(arguments)
        args.unshift('verbose')
        winston.log.apply(winston, args)
    }
    debug() {
        let args = Array.prototype.slice.call(arguments)
        args.unshift('debug')
        winston.log.apply(winston, args)
    }
    silly() {
        let args = Array.prototype.slice.call(arguments)
        args.unshift('silly')
        winston.log.apply(winston, args)
    }
}

module.exports = church = new Church(':')
