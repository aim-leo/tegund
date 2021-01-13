const {
  allTypes, isEmpty, isUndefined
} = require('./validate')

const { T, ObjectT, ArrayT, NotAtT, AtT } = require('./proto')

const result = {
  at: (...types) => new AtT(...types),
  notat: (...types) => new NotAtT(...types),
  any: () => new T(),
  empty: () => {
    const t = new T()

    t.validate(isEmpty)

    return t
  },
  never: () => {
    const t = new T()

    t.validate(v => !isUndefined(v))

    return t
  },
}

for (const type of allTypes) {
  const name = type.toLowerCase()

  result[name] = child => {
    const Proto = type === 'Object' ? ObjectT : (type === 'Array' ? ArrayT : T)
    const t = new Proto(child)

    t.type(type)

    return t
  }
}

module.exports = result