const hashCode = require('../functions/hashCode')
const seed = 0

module.exports = function generateHashCode() {
    return hashCode(`${process.pid} + ${Date.now()} + ${seed ++}`) 
}