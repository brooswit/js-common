const Resolver = require('../classes/Resolver')

module.exports = async function promiseCallback(context, method) {
    const resolver = new Resolver()
    const args = Array.prototype.slice.call(arguments, 2)
    args.push(resolver.resolve)
    method.apply(context, args)
    return await resolver
}
