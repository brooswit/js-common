const NO_OP = require('./NO_OP')

module.exports = function makePry (Class) {
  const pryClassIdKey = `___pry${Class.name}Id`

  let stores = {}
  let nextClassId = 0

  function pry (source) {
    let id = source[pryClassIdKey] = source[pryClassIdKey] = nextClassId++
    stores[id] = stores[id] || {}
    stores.id = id
    stores.done = done
    return stores[id]
  }

  function done () {
    this.done = NO_OP
    delete stores[this.id]
  }

  return pry
}
