const Resolver = require('../classes/Resolver')

module.exports = async function promiseCallback(context, method) {
    return new Promise((resolve) => {
        const args = Array.prototype.slice.call(arguments, 2)
        args.push(resolve)
        method.apply(context, args)
    })
}
