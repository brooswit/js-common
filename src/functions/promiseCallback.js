const Resolver = require('../classes/Resolver')

module.exports = async function promiseCallback(context, method) {
    const resolver = new Resolver()
    console.log(arguments)
    const args = Array.slice.call(arguments, 2)
    args.push(resolver.resolve)
    method.call(context, args)
    return await resolver
}
