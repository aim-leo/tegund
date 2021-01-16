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

  validate(v) {
    asset(v, 'Function')

    this._validate.push(v)
  }

  check(...datas) {
    if (datas.length === 0) return false
    
    for (const data of datas) {
      // check root type
      let typeValid = false

      if (this.typeArray.length == 0) typeValid = true

      for (const type of this.typeArray) {
        const typeV = getValidateByType(type)
        if (isFunction(typeV) && typeV(data)) {
          typeValid = true
          break
        }
      }

      if (!typeValid) return false

      // check addtional validate
      for (const v of this._validate) {
        if (!v(data)) return false
      }
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

  check(...datas) {
    const result = super.check(...datas)

    if (!result) return false

    // check childs
    for (const data of datas) {
      for (const childKey in this._child) {
        const value = data[childKey]
        const t = this._child[childKey]

        if (!t.check(value)) {
          return false
        }
      }
    }

    return true
  }
}

class ArrayT extends T {
  constructor(...childs) {
    super()

    this._child = []

    if (childs.length > 0) this.setChild(...childs)
  }

  setChild(...childs) {
    // if the first argument is a array
    for (const child of childs) {
      if (child instanceof T) {
        this._child.push(child)
        continue
      }

      if (child === undefined) continue

      const t = new T()
      t.type(child)

      this._child.push(t)
    }
  }

  check(...datas) {
    const result = super.check(...datas)

    if (!result) return false

    const atChild = (data) => {
      if (this._child.length === 0) return true
      for (const child of this._child) {
        if (child.check(data)) return true
      }
    }

    // check childs
    for (const data of datas) {
      for (const item of data) {
        if (!atChild(item)) return false
      }
    }

    return true
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

  check(...datas) {
    const result = super.check(...datas)

    if (!result) return false

    for (const data of datas) {
      for (const type of this._maybeCondition) {
        if (type.check(data)) {
          return true
        }
      }
    }

    return false
  }
}

class NotAtT extends T {
  constructor(...types) {
    super()

    this._excludeCondition = []

    this.not(...types)
  }

  not(...types) {
    const result = this._format2Type(...types)

    result.map((t) => this._excludeCondition.push(t))

    return this
  }

  check(...datas) {
    const result = super.check(...datas)

    if (!result) return false

    for (const data of datas) {
      for (const type of this._excludeCondition) {
        if (type.check(data)) {
          return false
        }
      }
    }

    return true
  }
}

module.exports = {
  T,
  ObjectT,
  ArrayT,
  NotAtT,
  AtT
}
