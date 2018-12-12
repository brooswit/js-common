const AsyncArray = require('../../src/common/AsyncArray')

test('pushes and pops in order', async () => {
  let asyncArray = new AsyncArray()
  let value1 = {}
  let value2 = {}

  asyncArray.push(value1)
  asyncArray.push(value2)
  let result1 = await asyncArray.pop()
  let result2 = await asyncArray.pop()

  expect(result1).toEqual(value2)
  expect(result2).toEqual(value1)
})
