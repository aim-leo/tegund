const { T, ArrayT } = require('../v2/proto')

const {
  asset
} = require('../v2/validate')

class MongoT extends T {
  constructor(...args) {
    super(...args)

    this._schemaType = null
    this._default = null
    this._unique = false
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

  unique(flag = true) {
    asset(t, 'Boolean', 'unique expected a boolean')

    this._unique = flag;

    return this;
  }

  schemaType(t) {
    asset(t, 'String', 'schemaType expected a string')

    this._schemaType = t

    return this
  }
}

class MongoArrayT extends ArrayT {
  
}


module.exports = {
  MongoT
}