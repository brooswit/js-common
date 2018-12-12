const argsFromOpts = require('../../src/common/argsFromOpts')

test('outputs options transformed to argument array for a function', () => {
  function func (a, b, c) {}
  let opts = { a: 0, b: 1, c: 2 }
  let funcArgs = argsFromOpts(opts, func)
  let expectedArgs = [0, 1, 2]
  expect(funcArgs).toEqual(expectedArgs)
})
