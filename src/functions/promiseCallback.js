module.exports = async function promiseCallback(context, method) {
        const args = Array.prototype.slice.call(arguments, 2)
        return new Promise((resolve) => {
            args.push(resolve)
            method.apply(context, args)
    })
}
