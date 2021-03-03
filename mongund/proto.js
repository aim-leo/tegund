const { T, ArrayT } = require('../v2/proto')

const { asset } = require('../v2/validate')

const { defineEnumerableProperty } = require('../v2/helper')

class MongoT extends T {
  constructor(...args) {
    super(...args)

    this._default = null

    this._defineProp({
      key: 'schemaType',
      type: 'String',
    })

    this._defineProp({
      key: 'getter',
      type: 'Function',
    })

    this._defineBooleanProps('unique', 'exclude')
  }

  default(val) {
    // before set default value, validate it
    const err = this.test(val)
    if (err) {
      throw err
    }

    this._default = val

    return this
  }

  _defineProp({ key, type, defaultValue = null, argDefaultValue }) {
    asset(key, 'String', 'prop key expected a string')
    asset(type, 'String', 'prop type expected a string')

    this[`_${key}`] = defaultValue

    defineEnumerableProperty(this, key, (val = argDefaultValue) => {
      asset(val, type, `${key} expected a ${type}`)

      this[`_${key}`] = val

      return this
    })
  }

  _defineBooleanProps(...args) {
    for (const key of args) {
      this._defineProp({
        key,
        type: 'Boolean',
        defaultValue: false,
        argDefaultValue: true,
      })
    }
  }

  clone() {
    console.log(Object.keys(this))
  }
}

class MongoArrayT extends ArrayT {}

module.exports = {
  MongoT,
}
