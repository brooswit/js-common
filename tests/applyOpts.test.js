const applyOpts = require('../../src/common/applyOpts')

test('applys options as arguments to function in context', () => {
  function func (index) {
    return this.list[index]
  }
  let opts = { index: 1 }
  let context = { list: ['a', 'b', 'c'] }
  let result = applyOpts(func, opts, context)
  let expectedResult = 'b'
  expect(result).toEqual(expectedResult)
})
