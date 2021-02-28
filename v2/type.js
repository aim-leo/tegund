const {
  allTypes
} = require('./validate')

const { T, ObjectT, ArrayT, NotAtT, AtT, NeverT } = require('./proto')
const { defineEnumerableProperty } = require('./helper')

const type = {
  at: (...types) => new AtT(...types),
  notat: (...types) => new NotAtT(...types)
}

defineType('any', new T())
defineType('never', new NeverT())

for (const type of allTypes) {
  const name = type.toLowerCase()

  defineType(name, (...child) => {
    const Proto = type === 'Object' ? ObjectT : (type === 'Array' ? ArrayT : T)
    const t = new Proto(...child)

    t.type(type)

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

defineEnumerableProperty(type, 'defineType', defineType)

module.exports = type