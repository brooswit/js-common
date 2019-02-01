const winston = require('winston')

module.exports = class Church {
    constructor(namespace) {
        this._namespace = namespace
    }
    get level() {
        return winston.level
    }
    set level(value) {
        winston.level = value
    }
    error() {
        winston.log()
    }
    warn() {

    }
    info() {

    }
    verbose() {

    }
    debug() {

    }
    silly() {

    }
}