const hashCode = require('./hashCode')
const seed = 0

module.exports = function generateHashCode() {
    return hashCode(`${process.pid} + ${Date.now()} + ${seed ++}`) 
}