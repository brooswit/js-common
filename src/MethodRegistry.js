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

  fire (methodName, payload, context) {
    if (this._methods[methodName]) {
      applyOpts(this._methods[methodName], payload, context)
    }
  }
}
