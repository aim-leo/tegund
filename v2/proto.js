const clone = require('clone')

const { ValidateTypeError, ValidateError } = require('./error')
const { rangeMixin, enumMixin, parttenMixin } = require('./mixin')
const {
  asset,
  isFunction,
  isString,
  getValidateByType,
  allTypes,
  inType,
  isObject,
} = require('./validate')

const { objectOverflow } = require('./helper')

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

  addValidator({ name, validator, message }) {
    asset(validator, 'Function')
    if (message) asset(message, 'String')
    if (name) asset(name, 'String')

    // if this validator has added, update it
    if (name) {
      const index = this._validate.map(item => item.name).indexOf(name)

      if (index !== -1) {
        this._validate.splice(index, 1)
      }
    }

    this._validate.push({
      validator,
      message,
      name
    })
  }

  removeValidator(name) {
    asset(name, 'String')
    asset(name, val => !!val)

    const index = this._validate.map(item => item.name).indexOf(name)

    if (index !== -1) {
      this._validate.splice(index, 1)
    }
  }

  test(...datas) {
    if (this instanceof NeverT) {
      return datas.length > 0
        ? new ValidateError({
            message: `${
              datas.length > 1 ? 'Index:' + index + ',' : ''
            } this field is not allow to entered>>>`,
          })
        : undefined
    } else if (datas.length === 0) {
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

  optional(data = true) {
    this._optional = data

    return this
  }

  clone() {
    return clone(this)
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
    this._strict = false

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

      // strict validate
      if (this._strict) {
        const overflowKey = objectOverflow(data, this._child)
        if (overflowKey) {
          return new ValidateError({
            message: `Cannot set properties other than Shema${
              datas.length > 1 ? ', at index:' + index + ',' : ''
            }, prop: ${overflowKey}`
          })
        }
      }

      for (const childKey in this._child) {
        const value = data[childKey]
        const t = this._child[childKey]

        if (t instanceof NeverT) {
          return childKey in data
            ? new ValidateError({
                message: `${
                  datas.length > 1 ? 'Index:' + index + ',' : ''
                }field ${childKey} is not allow to entered`,
              })
            : undefined
        } else {
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

  strict(data = true) {
    asset(data, 'Boolean', 'strict is expected a boolean')
    this._strict = data

    return this
  }

  extend(...args) {
    for (let item of args) {
      if (item instanceof ObjectT) {
        this._child = Object.assign(this._child || {}, item._child)
      } else if (isObject(item)) {
        item = new ObjectT(item)
        this._child = Object.assign(this._child || {}, item._child)
      } else {
        throw new Error(`combine expected a object or a ObjectT, but got a ${item}`)
      }
    }

    return this
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

class NeverT extends T {}

module.exports = {
  T,
  ObjectT,
  ArrayT,
  NotAtT,
  AtT,
  NeverT,
}
