const getArgNames = require('./getArgNames')

module.exports = function argsFromOpts (opts, func) {
  let args = []
  let argNames = getArgNames(func)
  for (let argIndex in argNames) {
    let argName = argNames[argIndex]
    args[argIndex] = opts[argName]
  }
  return args
}
