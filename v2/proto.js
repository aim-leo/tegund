const { ValidateTypeError, ValidateError } = require('./error')
const { rangeMixin, enumMixin, parttenMixin } = require('./mixin')
const {
  asset,
  isFunction,
  isString,
  getValidateByType,
  allTypes,
  inType
} = require('./validate')

class T {
  constructor() {
    Object.assign(this, enumMixin)

    this._type = null

    this._validate = []
    this._optional = false
  }

  type(type) {
    const result = this._format2TypeString(type)

    this._type = result

    if (['String', 'Array'].includes(this._type)) {
      Object.assign(this, rangeMixin)
    }

    if (['String', 'Number'].includes(this._type)) {
      Object.assign(this, parttenMixin)
    }

    return this
  }

  validate(validator, message) {
    asset(validator, 'Function')
    if (message) asset(message, 'String')

    this._validate.push({
      validator,
      message,
    })
  }

  // return a object like { pass: false, message: 'not a valid string' }
  test(...datas) {
    if (datas.length === 0) {
      return new ValidateError({
        message: `None is not a ${this._type} type`,
      })
    }
    for (const index in datas) {
      const data = datas[index]

      // if is undefined, and set optional
      if (data === undefined && this._optional) continue

      // test root type
      let typeValid = false

      if (!this._type) {
        typeValid = true
      } else {
        const typeV = getValidateByType(this._type)
        if (isFunction(typeV) && typeV(data)) {
          typeValid = true
        }
      }

      if (!typeValid) {
        return new ValidateTypeError({
          source: data,
          index,
          type: this._type,
        })
      }

      // test addtional validate
      for (const v of this._validate) {
        const res = v.validator(data)
        if (res instanceof ValidateError) return res
        if (res === false) return new ValidateError({ message: v.message })
      }
    }
  }

  check(...datas) {
    const error = this.test(...datas)

    if (error instanceof ValidateError) {
      return false
    }

    return true
  }

  optional(data) {
    this._optional = data

    return this
  }

  _format2TypeString(type) {
    if (type instanceof T) {
      return type._type
    } else if (isString(type) && allTypes.includes(type)) {
      return type
    }
  }

  _format2Type(...types) {
    const result = []
    for (let type of types) {
      if (type instanceof T) {
        result.push(type)
      } else if (isString(type) && allTypes.includes(type)) {
        const t = new T()

        t.type(type)

        result.push(t)
      }
    }

    return result
  }
}

class AtT extends T {
  constructor(...types) {
    super()

    this._maybeCondition = []
    this._isReverse = false

    this.or(...types)
  }

  or(...types) {
    const result = this._format2Type(...types)

    result.map((t) => this._maybeCondition.push(t))

    return this
  }

  test(...datas) {
    const result = super.test(...datas)

    if (result) return result

    const pass = (data) => {
      for (const type of this._maybeCondition) {
        const e = type.test(data)

        if (!e) {
          return true
        }
      }
    }

    for (const data of datas) {
      if (!this._isReverse && !pass(data)) {
        return new ValidateError()
      }

      if (this._isReverse && pass(data)) {
        return new ValidateError()
      }
    }
  }
}

class NotAtT extends AtT {
  constructor(...args) {
    super(...args)

    this._isReverse = true
  }
}

class ObjectT extends T {
  constructor(child) {
    super()

    this._child = null

    if (child !== undefined) this.setChild(child)
  }

  setChild(child) {
    asset(child, 'Object')

    if (child instanceof T) return

    const result = {}

    // format all value to T
    for (const key in child) {
      let value = child[key]

      if (value instanceof T) {
        result[key] = value
        continue
      }

      const t = new T()

      // // if it was a real data, set validate to equal
      // // if is a function, set it to validate
      // t.validate(isFunction(value) ? value : s => s === value)
      t.type(value)

      result[key] = t
    }

    this._child = result
  }

  test(...datas) {
    const result = super.test(...datas)

    if (result) return result

    // test childs
    for (const index in datas) {
      const data = datas[index]
      for (const childKey in this._child) {
        const value = data[childKey]
        const t = this._child[childKey]

        const e = t.test(value)
        if (e) {
          return new ValidateError({
            ...e,
            message: `${
              datas.length > 1 ? 'Index:' + index + ',' : ''
            }field ${childKey} is validate error, ${e.message}`,
          })
        }
      }
    }
  }
}

class ArrayT extends T {
  constructor(...childs) {
    super()

    this._child = null

    if (childs.length > 0) this.setChild(...childs)
  }

  setChild(...childs) {
    this._child = new AtT(...childs)
  }

  test(...datas) {
    const result = super.test(...datas)

    if (result) return result

    if (!this._child) return 

    // test childs
    for (const index of datas) {
      const data = datas[index]

      const e = this._child.test(...data)

      if (e) {
        return e
      }
    }
  }
}

module.exports = {
  T,
  ObjectT,
  ArrayT,
  NotAtT,
  AtT,
}
