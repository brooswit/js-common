const applyOpts = require('./applyOpts')

module.exports = class MethodRegistry {
  constructor () {
    this._methods = {}
  }

  register (methodName, method) {
    if (!method) {
      this.unregister(methodName)
      return
    }
    this._methods[methodName] = method
  }

  unregister (methodName) {
    delete this._methods[methodName]
  }

  execute (methodName, payload, context) {
    const method = this._methods[methodName]
    if (method) {
      let result = applyOpts(method, payload, context)
      if (!result.then) {
        result = (async () => {return result})()
      }
      return result
    }
  }
}
