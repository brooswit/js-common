const {isAsync} = require('../common')

module.exports = async function run (func) {
    return isAsync(func) ? await func() : func()
}
