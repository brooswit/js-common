const argsFromOpts = require('./argsFromOpts')

module.exports = function applyOpts (func, opts, context) {
  let args = argsFromOpts(opts, func)
  return func.apply(context, args)
}
