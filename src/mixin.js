const { assert, isFunction } = require('./validate')

const { relateDate, formatDate } = require('./helper')

const rangeMixin = {
  length(length, message) {
    assert(length, 'Integer', 'length expected a integer')
    assert(length, (val) => val >= 0, 'length expected a integer gte then 0')

    this._length = length

    // add a validator
    this.addValidator({
      name: 'Length',
      validator: this._validateLength.bind(this),
      message:
        message ||
        ((data) =>
          `expected a ${this._type}, length at ${this._length}, but got a length: ${data.length}`)
    })

    return this
  },
  min(min, message) {
    assert(min, 'Integer', 'min expected a integer')
    assert(min, (val) => val > 0, 'min expected a integer gte then 0')

    if (this._max) {
      assert(
        min,
        (val) => val <= this._max,
        `min expected a integer lte then max: ${this._max}`
      )
    }

    this._min = min

    this.addValidator({
      name: 'Min',
      validator: this._validateMin.bind(this),
      message:
        message ||
        ((data) =>
          `expected a ${this._type}, length gte than ${this._min}, but got a length: ${data.length}`)
    })

    return this
  },
  max(max, message) {
    assert(max, 'Integer', 'max expected a integer')
    assert(max, (val) => val > 0, 'max expected a integer gte then 0')

    if (this._min) {
      assert(
        max,
        (val) => val >= this._min,
        `min expected a integer lte then max: ${this._min}`
      )
    }

    this._max = max

    this.addValidator({
      name: 'Max',
      validator: this._validateMax.bind(this),
      message:
        message ||
        ((data) =>
          `expected a ${this._type}, length lte than ${this._max}, but got a length: ${data.length}`)
    })

    return this
  },
  _validateLength(data) {
    if (this._length === undefined) return
    if (!['String', 'Array'].includes(this._type)) return

    return data.length === this._length
  },
  _validateMin(data) {
    if (this._min === undefined) return
    if (!['String', 'Array'].includes(this._type)) return

    return data.length >= this._min
  },
  _validateMax(data) {
    if (this._max === undefined) return
    if (!['String', 'Array'].includes(this._type)) return

    return data.length <= this._max
  }
}

const numberRangeMixin = {
  min(min, message) {
    assert(min, 'Integer', 'min expected a integer')

    if (this._max) {
      assert(
        min,
        (val) => val <= this._max,
        `min expected a integer lte then max: ${this._max}`
      )
    }

    this._min = min

    this.addValidator({
      name: 'Min',
      validator: this._validateMin.bind(this),
      message:
        message ||
        ((data) =>
          `expected a ${this._type}, value gte than ${this._min}, but got a: ${data}`)
    })

    return this
  },
  max(max, message) {
    assert(max, 'Integer', 'max expected a integer')

    if (this._min) {
      assert(
        max,
        (val) => val >= this._min,
        `min expected a value integer lte then max: ${this._min}`
      )
    }

    this._max = max

    this.addValidator({
      name: 'Max',
      validator: this._validateMax.bind(this),
      message:
        message ||
        ((data) =>
          `expected a ${this._type}, value lte than ${this._max}, but got a: ${data}`)
    })

    return this
  },
  _validateMin(data) {
    if (this._min === undefined) return
    if (!['Number', 'Integer', 'Float'].includes(this._type)) return

    return data >= this._min
  },
  _validateMax(data) {
    if (this._max === undefined) return
    if (!['Number', 'Integer', 'Float'].includes(this._type)) return

    return data <= this._max
  }
}

const dateRangeMixin = {
  min(min, message) {
    assert(min, 'Date', 'min expected a date')

    if (this._max) {
      assert(
        min,
        (val) => relateDate(val, this._max) === -1,
        `min scope expected a date before ${formatDate(
          this._max
        )}, but got a ${formatDate(min)}`
      )
    }

    this._min = min

    this.addValidator({
      name: 'Min',
      validator: this._validateMin.bind(this),
      message:
        message ||
        ((data) =>
          `expected a date after ${formatDate(
            this._min
          )}, but got a ${formatDate(data)}`)
    })

    return this
  },
  max(max, message) {
    assert(max, 'Date', 'max expected a date')

    if (this._min) {
      assert(
        max,
        (val) => relateDate(val, this._min) === 1,
        `max scope expected a date after ${formatDate(
          this._min
        )}, but got a ${formatDate(max)}`
      )
    }

    this._max = max

    this.addValidator({
      name: 'Max',
      validator: this._validateMax.bind(this),
      message:
        message ||
        ((data) =>
          `expected a date before ${formatDate(
            this._max
          )}, but got a ${formatDate(data)}`)
    })

    return this
  },
  _validateMin(data) {
    if (this._min === undefined) return

    return relateDate(data, this._min) !== -1
  },
  _validateMax(data) {
    if (this._max === undefined) return

    return relateDate(data, this._max) !== 1
  }
}

const enumMixin = {
  enum(arr, message) {
    assert(arr, 'Array', 'enum expected a array')

    // validate enum value
    if (isFunction(this.check)) {
      const err = this.test(...arr)

      if (err) throw err
    }

    this._enum = arr

    this.addValidator({
      name: 'Enum',
      validator: this._validateEnum.bind(this),
      message:
        message ||
        ((data) => `expected a data value at ${this._enum}, but got a ${data}`)
    })

    return this
  },
  _validateEnum(data) {
    if (this._enum === undefined) return

    return this._enum.includes(data)
  }
}

const patternMixin = {
  pattern(reg, message) {
    assert(reg, 'Pattern', 'pattern expected a reg')

    this._pattern = reg

    this.addValidator({
      name: 'Pattern',
      validator: this._validatePattern.bind(this),
      message:
        message ||
        `expected a data match pattern: /${this._pattern.source}/${this._pattern.flags}`
    })

    return this
  },
  _validatePattern(data) {
    if (this._pattern === undefined) return
    if (!['String', 'Number'].includes(this._type)) return

    return this._pattern.test(data)
  }
}

function useMixin(target, mixin) {
  for (const key in mixin) {
    target[key] = mixin[key]
    // if (key.indexOf('_') === -1) {
    //   target[key] = mixin[key]
    // } else {
    //   defineUnEnumerableProperty(target, key, mixin[key])
    // }
  }
}

module.exports = {
  rangeMixin,
  enumMixin,
  patternMixin,
  dateRangeMixin,
  numberRangeMixin,

  useMixin
}
