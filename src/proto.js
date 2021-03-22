const { ValidateTypeError, ValidateError } = require('./error')
const {
  rangeMixin,
  enumMixin,
  patternMixin,
  dateRangeMixin,
  numberRangeMixin,
  useMixin,
} = require('./mixin')
const {
  assert,
  isFunction,
  isString,
  getValidateByType,
  isObject,
} = require('./validate')

const { objectOverflow } = require('./helper')

class T {
  constructor() {
    this._type = null
    this._alias = null

    this._validate = []
    this._optional = false

    this._context = {}

    useMixin(this, enumMixin)
  }

  type(type) {
    const result = this._format2TypeString(type)

    this._type = result

    if (['String', 'Array'].includes(this._type)) {
      useMixin(this, rangeMixin)
    }

    if (['Number', 'Integer', 'Float'].includes(this._type)) {
      useMixin(this, numberRangeMixin)
    }

    if (['String', 'Number', 'Integer', 'Float'].includes(this._type)) {
      useMixin(this, patternMixin)
    }

    if (this._type === 'Date') {
      useMixin(this, dateRangeMixin)
    }

    return this
  }

  alias(name) {
    assert(name, 'String', 'alias expected a string')

    this._alias = name

    return this
  }

  forbid(val = true) {
    assert(val, 'Boolean')

    this.constructor = val ? NeverT : T

    return this
  }

  instance(parent) {
    assert(parent, 'SyncFunction')

    this.addValidator({
      name: 'InstanceValidator',
      validator: (val) => val instanceof parent,
      message: `data expected instance of parent: ${parent.name}`,
    })

    return this
  }

  or(...other) {
    other = this._format2Type(...other)

    const t = new AtT()

    t.or(this, ...other)

    return t
  }

  setContext(key, value) {
    assert(key, 'String', 'context expected a object')

    this._context[key] = value

    return this
  }

  clearContext(key) {
    if (key) {
      delete this._context[key]
    } else {
      this._context = {}
    }

    return this
  }

  addValidator({ name, validator, message }) {
    assert(validator, 'Function')
    if (message && !isString(message) && !isFunction(message)) {
      throw new Error('message expected a string || function')
    }
    if (name) assert(name, 'String')

    // if this validator has added, update it
    if (name) {
      this.removeValidator(name)
    }

    this._validate.push({
      validator,
      message,
      name,
    })

    return this
  }

  removeValidator(name) {
    assert(name, 'String')
    assert(name, (val) => !!val)

    const index = this._validate.map((item) => item.name).indexOf(name)

    if (index !== -1) {
      this._validate.splice(index, 1)
    }
  }

  test(...datas) {
    function test() {
      if (this.constructor === NeverT) {
        return datas.length > 0
          ? new ValidateError({
              message: 'this field is not allow to entered',
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
          const res = v.validator.call(this, data)
          if (res instanceof ValidateError) return res
          if (res === false) {
            return new ValidateError({ message: v.message, source: data })
          }
        }
      }
    }

    let testResult = null

    try {
      testResult = test.call(this)
    } catch (e) {
      return e
    }

    return testResult
  }

  check(...datas) {
    const error = this.test(...datas)

    if (error instanceof ValidateError) {
      return false
    }

    return true
  }

  assert(...datas) {
    const error = this.test(...datas)

    if (error instanceof ValidateError) {
      throw error
    }
  }

  optional(data = true) {
    this._optional = data

    return this
  }

  clone() {
    const t = new T()

    Object.assign(t, this)

    return t
  }

  _format2TypeString(type) {
    if (type instanceof T) {
      return type._type
    } else if (isString(type)) {
      return type
    }
  }

  _format2Type(...types) {
    const allDefinedTypes = require('./type')
    const result = []
    for (const type of types) {
      if (type instanceof T) {
        result.push(type)
      } else if (isString(type) && type in allDefinedTypes) {
        result.push(allDefinedTypes[type]())
      } else{
        throw new Error(`type is not a valid T || t alias`)
      }
    }

    return result
  }
}

class AtT extends T {
  constructor(...types) {
    super()

    this._maybeCondition = []

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
      if (data === undefined && this._optional) {
        continue
      }

      if (!(this instanceof NotAtT) && !pass(data)) {
        return new ValidateError()
      }

      if (this instanceof NotAtT && pass(data)) {
        return new ValidateError()
      }
    }
  }

  clone() {
    const t = new AtT()
    Object.assign(t, this)

    t._maybeCondition = this._maybeCondition.map((item) => item.clone())

    return t
  }

  setContext(...args) {
    super.setContext(...args)

    // set context to child
    if (this._maybeCondition) {
      for (const t of this._maybeCondition) {
        t.setContext(...args)
      }
    }

    return this
  }

  clearContext(...args) {
    super.clearContext(...args)

    // set context to child
    if (this._maybeCondition) {
      for (const t of this._maybeCondition) {
        t.clearContext(...args)
      }
    }

    return this
  }
}

class NotAtT extends AtT {
  clone() {
    const t = new NotAtT()
    Object.assign(t, this)

    t._maybeCondition = this._maybeCondition.map((item) => item.clone())

    return t
  }
}

class ObjectT extends T {
  constructor(child) {
    super()

    this._child = null
    this._strict = false

    this.type('Object')

    if (child !== undefined) this.setChild(child)
  }

  setChild(child) {
    assert(child, 'Object')

    if (child instanceof T) return

    const result = {}
    const allDefinedTypes = require('./type')

    // format all value to T
    for (const key in child) {
      const value = child[key]

      if (value instanceof T) {
        result[key] = value
        continue
      } else if (isString(value)) {
        if (value in allDefinedTypes) {
          result[key] = allDefinedTypes[value]()
        } else {
          const t = new T()
          t.type(value)

          result[key] = t
        }
        continue
      } else if (Array.isArray(value)) {
        result[key] = new ArrayT(value)
      } else if (typeof value === 'object') {
        result[key] = new ObjectT(value)
      }
    }

    this._child = result
  }

  testProvided(...datas) {
    this.setContext('ignoreUnprovided', true)

    const res = this.test(...datas)

    this.clearContext('ignoreUnprovided')

    return res
  }

  strict(data = true) {
    assert(data, 'Boolean', 'strict is expected a boolean')
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
        throw new Error(
          `combine expected a object or a ObjectT, but got a ${item}`
        )
      }
    }

    return this
  }

  clone() {
    const t = new ObjectT()
    Object.assign(t, this)

    for (const prop in this._child) {
      t._child[prop] = this._child[prop].clone()
    }

    return t
  }

  setContext(...args) {
    super.setContext(...args)

    // set context to child
    if (this._child) {
      for (const prop in this._child) {
        this._child[prop].setContext(...args)
      }
    }

    return this
  }

  clearContext(...args) {
    super.clearContext(...args)

    // set context to child
    if (this._child) {
      for (const prop in this._child) {
        this._child[prop].clearContext(...args)
      }
    }

    return this
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
            }, prop: ${overflowKey}`,
          })
        }
      }

      for (const childKey in this._child) {
        if (this._context.ignoreUnprovided && !(childKey in data)) continue

        const value = data[childKey]
        const t = this._child[childKey]

        // if is optional
        if (t._optional && !data.hasOwnProperty(childKey)) {
          continue
        }

        if (t.constructor === NeverT) {
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
              }field ${childKey} validate error, ${e.message}`,
            })
          }
        }
      }
    }
  }
}

class ArrayT extends T {
  constructor(...childs) {
    super()

    this._child = null
    this._childCate = null

    this.type('Array')

    if (childs.length > 0) this.setChild(...childs)
  }

  // if childs has one arg, and first arg is a [], mines struct, eg: array([string(), boolean()]), so we need input a array like that ['1', true]
  // if the childs has many args, so every arg should be a T
  setChild(...childs) {
    this._childCate = null
    this._child = null

    if (childs.length === 0) {
      return this
    }

    if (childs.length === 1 && Array.isArray(childs[0])) {
      if (childs[0].length === 0) {
        throw new Error('array struct should not be empty')
      }
      this._child = []
      // every one of this array should be T
      for (const key in childs[0]) {
        const item = childs[0][key]
        if (item === undefined) continue

        const t = this._format2Type(item)[0]

        if (!(t instanceof T)) {
          throw new Error('every item of array should be a T')
        }

        this._child[key] = t
      }

      return this
    }

    // every one of args should be T
    const ts = this._format2Type(...childs)
    for (const item of ts) {
      if (!(item instanceof T)) {
        throw new Error('every item of array should be a T')
      }
    }

    this._childCate = childs.length === 1 ? ts[0] : new AtT(...ts)

    return this
  }

  test(...datas) {
    const result = super.test(...datas)
    if (result) return result

    if (this._child) {
      // test childs
      for (const data of datas) {
        for (const index in this._child) {
          const t = this._child[index]
          if (!t) {
            continue
          }

          const childErr = t.test(data[index])
          if (childErr) {
            return childErr
          }
        }
      }
    }
    if (this._childCate) {
      for (const data of datas) {
        if (data.length === 0) continue

        const childCateErr = this._childCate.test(...data)

        if (childCateErr) {
          return childCateErr
        }
      }
    }
  }

  clone() {
    const t = new ArrayT()
    Object.assign(t, this)

    for (const prop in this._child) {
      t._child[prop] = this._child[prop].clone()
    }

    if (Array.isArray(this._childCate)) {
      t._childCate = this._childCate.map((item) => item.clone())
    } else if (this._childCate instanceof T) {
      t._childCate = this._childCate.clone()
    }

    return t
  }

  setContext(...args) {
    super.setContext(...args)

    // set context to child
    if (this._childCate) {
      this._childCate.setContext(...args)
    } else if (this._child) {
      this._child.map((item) => item.setContext(...args))
    }

    return this
  }

  clearContext(...args) {
    super.clearContext(...args)

    // set context to child
    if (this._childCate) {
      this._childCate.clearContext(...args)
    } else if (this._child) {
      this._child.map((item) => item.clearContext(...args))
    }

    return this
  }
}

class NeverT extends T {
  clone() {
    const t = new NeverT()
    Object.assign(t, this)

    return t
  }
}

module.exports = {
  T,
  ObjectT,
  ArrayT,
  NotAtT,
  AtT,
  NeverT,
}
