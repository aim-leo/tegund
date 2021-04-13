const {
  allTypes
} = require('./validate')

const { T, ObjectT, ArrayT, NotAtT, AtT, NeverT } = require('./proto')

const type = {
  defineType,
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
  type[alias] = typeof t === 'function' ? t : () => t.clone()

  return type[alias]
}

// add a alias for function
defineType('func', type.function)

// add a alias for undefined
defineType('undef', type.undefined)

// mongodb objectid
// not a strict validator, you can replace it by mongoose.Types.ObjectId.isValid
defineType('id', () => type.string().clone().convert().addValidator({
  name: 'MongoObjectIdValidator',
  validator: val => {
    const objIdPattern = /^[0-9a-fA-F]{24}$/;
    return (Boolean(val) && !Array.isArray(val) && objIdPattern.test(String(val)))
  },
  message: 'expect a valid mongo object id'
}))

module.exports = type
