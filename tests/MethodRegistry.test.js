const MethodRegistry = require('../../src/common/MethodRegistry')

test('after registering a method, it can then be fired with a paylaod', () => {
  let methodRegistry = new MethodRegistry()
  let jestFunc = jest.fn()
  function func (arg1, arg2) {
    jestFunc(arg1, arg2)
  }
  let payload = { arg1: 'value1', arg2: 'value2' }

  methodRegistry.register('test', func)
  methodRegistry.fire('test', payload)

  expect(jestFunc).toHaveBeenCalledTimes(1)
  expect(jestFunc).toHaveBeenCalledWith('value1', 'value2')
})

test('after removinging a once registered method, it can no longer be fired', () => {
  let methodRegistry = new MethodRegistry()
  let jestFunc = jest.fn()
  function func (arg1, arg2) {
    jestFunc(arg1, arg2)
  }

  methodRegistry.register('test', func)
  methodRegistry.unregister('test')
  methodRegistry.fire('test')

  methodRegistry.register('test', func)
  methodRegistry.register('test')
  methodRegistry.fire('test')

  expect(jestFunc).toHaveBeenCalledTimes(0)
})
