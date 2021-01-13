const { asset, isFunction, getValidateByType } = require('./validate')

class T{
  constructor() {
    this._type = new Set()

    this._validate = []
  }

  get typeArray() {
    return Array.from(this._type)
  }

  type(...t) {
    for (const item of t) {
      asset(item, 'String')

      this._type.add(item)
    }
  }

  validate(v) {
    asset(v, 'Function')

    this._validate.push(v)
  }

  check(data) {
    // check root type
    let typeValid = false
    for (const type of this.typeArray) {
      const typeV = getValidateByType(type)
      if (isFunction(typeV) && typeV(data)) {
        typeValid = true
      }
    }

    if (!typeValid) return false

    // check addtional validate
    for (const v of this._validate) {
      if (!v(data)) return false
    }

    return true
  }
}


class ObjectT extends T{
  constructor(child) {
    super()

    this._child = null

    if (child !== undefined) this.setChild(child)
  }

  setChild(child) {
    asset(child, 'Object')

    const result = {}

    // format all value to T
    for (const key in child) {
      let value = child[key]

      if (value instanceof T) {
        result[key] = value
        continue
      }

      const t = new T()

      // if it was a real data, set validate to equal
      // if is a function, set it to validate
      t.validate(isFunction(value) ? value : s => s === value)

      result[key] = t
    }

    this._child = result
  }
}

class ArrayT extends T{
  constructor(child) {
    super()

    this._child = null

    if (child !== undefined) this.setChild(child)
  }

  setChild(child) {
    if (child instanceof T) {
      this._child = child
    }

    const t = new T()

    // if it was a real data, set validate to equal
    // if is a function, set it to validate
    t.validate(isFunction(child) ? child : s => s === child)

    this._child = t
  }
}

class AtT extends T {
  constructor(...types) {
    super()

    this._excludeType = new Set()

    this.in(...types)
  }

  in(...types) {
    for (let type of types) {
      if (type instanceof T) {
        type = type.typeArray
      }
      this.type(...type)
    }
  }
}

class NotAtT extends T {
  constructor(...types) {
    super()

    this._excludeType = new Set()

    this.not(...types)
  }

  not(...types) {
    for (let type of types) {
      if (type instanceof T) {
        type = type.typeArray
      }
      
      this._exclude(...type)
    }
  }

  _exclude(...t) {
    for (const item of t) {
      asset(item, 'String')

      this._excludeType.add(item)
    }
  }
}


module.exports = {
  T,
  ObjectT,
  ArrayT,
  AtT,
  NotAtT
}