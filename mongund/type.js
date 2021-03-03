const { MongoT } = require('./proto')

const type = {}

const basicTypes = ['String', 'Number', 'Date', 'Boolean']

for (const type of basicTypes) {
  const name = type.toLowerCase()

  defineType(name, (...child) => {
    const Proto = MongoT
    const t = new Proto(...child)

    t.type(type)
    t.schemaType(type)

    return t
  })
}

defineType(
  'id',
  type
    .string()
    .pattern(
      /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
      '请输入一个个合格的mongoId'
    )
    .schemaType('ObjectId')
)

defineType('any', new MongoT().schemaType('Mixed'))

function defineType(alias, t) {
  if (alias in type) {
    throw new Error(`${alias} is defined, please check`)
  }

  type[alias] = typeof t === 'function' ? t : () => t.clone()

  return type[alias]
}

module.exports = type
