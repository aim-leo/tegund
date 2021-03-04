const {
  allTypes
} = require('./validate')

const { T, ObjectT, ArrayT, NotAtT, AtT, NeverT } = require('./proto')
const { defineUnEnumerableProperty } = require('./helper')

const type = {
  at: (...types) => new AtT(...types),
  notat: (...types) => new NotAtT(...types)
}

defineType('any', new T())
defineType('never', new NeverT())

for (const item of allTypes) {
  const name = item.toLowerCase()

  defineType(name, (...child) => {
    const Proto = item === 'Object' ? ObjectT : (item === 'Array' ? ArrayT : T)
    const t = new Proto(...child)

    t.type(item)

    return t
  })
}

function defineType(alias, t) {
  if (alias in type) {
    throw new Error(`${alias} is defined, please check`)
  }

  type[alias] = typeof t === 'function' ? t : () => t.clone()

  return type[alias]
}

defineUnEnumerableProperty(type, 'defineType', defineType)

module.exports = type
