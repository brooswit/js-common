const applyOpts = require('./applyOpts')

module.exports = class MethodRegistry {
  constructor () {
    this._methods = {}
  }

  register (methodName, method, context) {
    if (!method) {
      this.unregister(methodName)
      return
    }
    this._methods[methodName] = method
  }

  unregister (methodName) {
    delete this._methods[methodName]
  }

  execute (methodName, payload) {
    const method = this._methods[methodName]
    if (method) {
      let result = applyOpts(method, payload)
      if (!result.then) {
        result = (async () => {return result})()
      }
      return result
    }
  }
}
