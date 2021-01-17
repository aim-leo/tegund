const { ValidateTypeError, ValidateError } = require('./error')
const {
  asset,
  isFunction,
  isString,
  getValidateByType,
  allTypes,
} = require('./validate')

class T {
  constructor() {
    this._type = new Set()

    this._validate = []
  }

  get typeArray() {
    return Array.from(this._type)
  }

  type(...types) {
    const result = this._format2TypeString(...types)

    result.map((t) => this._type.add(t))

    return this
  }

  validate(validator, message) {
    asset(validator, 'Function')
    asset(message, 'String')

    this._validate.push({
      validator,
      message,
    })
  }

  // return a object like { pass: false, message: 'not a valid string' }
  inspect(...datas) {
    if (datas.length === 0)
      return new ValidateError({
        message: `None is not a valid type at ${this.typeArray}`,
      })
    for (const index in datas) {
      const data = datas[index]
      // inspect root type
      let typeValid = false

      if (this.typeArray.length === 0) {
        typeValid = true
      }

      for (const type of this.typeArray) {
        const typeV = getValidateByType(type)
        if (isFunction(typeV) && typeV(data)) {
          typeValid = true
          break
        }
      }

      if (!typeValid) {
        return new ValidateTypeError({
          source: data,
          index,
          type: this.typeArray,
        })
      }

      // inspect addtional validate
      for (const v of this._validate) {
        if (!v.validator(data)) return new ValidateError({ message: v.message })
      }
    }
  }

  check(...datas) {
    const error = this.inspect(...datas)

    if (error instanceof ValidateError) {
      return false
    }

    return true
  }

  _format2TypeString(...types) {
    const result = []
    for (let type of types) {
      if (type instanceof T) {
        type = type.typeArray
      } else if (isString(type) && allTypes.includes(type)) {
        type = [type]
      } else {
        continue
      }

      result.push(...type)
    }

    return result
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

  inspect(...datas) {
    const result = super.inspect(...datas)

    if (result) return result

    const pass = (data) => {
      for (const type of this._maybeCondition) {
        const e = type.inspect(data)

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

  inspect(...datas) {
    const result = super.inspect(...datas)

    if (result) return result

    // inspect childs
    for (const index in datas) {
      const data = datas[index]
      for (const childKey in this._child) {
        const value = data[childKey]
        const t = this._child[childKey]

        const e = t.inspect(value)
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

  inspect(...datas) {
    const result = super.inspect(...datas)

    if (result) return result

    if (!this._child) return 

    // inspect childs
    for (const index of datas) {
      const data = datas[index]

      const e = this._child.inspect(...data)

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
