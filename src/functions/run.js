const isAsync = require('../functions/isAsync')

module.exports = async function run (func) {
    return isAsync(func) ? await func() : func()
}
