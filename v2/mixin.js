const { ValidateError } = require('./error')

const { asset, isFunction } = require('./validate')

const { relateDate, formatDate } = require('./helper')

const rangeMixin = {
  length(length) {
    asset(length, 'Integer', 'length expected a integer')
    asset(length, (val) => val >= 0, 'length expected a integer gte then 0')

    this._length = length

    // add a validator
    this.addValidator({
      name: 'Length',
      validator: this._validateLength.bind(this),
    })

    return this
  },
  min(min) {
    asset(min, 'Integer', 'min expected a integer')
    asset(min, (val) => val > 0, 'min expected a integer gte then 0')

    if (this._max) {
      asset(
        min,
        (val) => val <= this._max,
        `min expected a integer lte then max: ${this._max}`
      )
    }

    this._min = min

    this.addValidator({ name: 'Min', validator: this._validateMin.bind(this) })

    return this
  },
  max(max) {
    asset(max, 'Integer', 'max expected a integer')
    asset(max, (val) => val > 0, 'max expected a integer gte then 0')

    if (this._min) {
      asset(
        max,
        (val) => val >= this._min,
        `min expected a integer lte then max: ${this._min}`
      )
    }

    this._max = max

    this.addValidator({ name: 'Max', validator: this._validateMax.bind(this) })

    return this
  },
  _validateLength(data) {
    if (this._length === undefined) return
    if (!['String', 'Array'].includes(this._type)) return

    if (data.length !== this._length) {
      return new ValidateError({
        message: `expected a ${this._type}, length at ${this._length}, but got a length: ${data.length}`,
      })
    }
  },
  _validateMin(data) {
    if (this._min === undefined) return
    if (!['String', 'Array'].includes(this._type)) return

    if (data.length < this._min) {
      return new ValidateError({
        message: `expected a ${this._type}, length gte than ${this._min}, but got a length: ${data.length}`,
      })
    }
  },
  _validateMax(data) {
    if (this._max === undefined) return
    if (!['String', 'Array'].includes(this._type)) return

    if (data.length > this._max) {
      return new ValidateError({
        message: `expected a ${this._type}, length lte than ${this._max}, but got a length: ${data.length}`,
      })
    }
  },
}

const dateRangeMixin = {
  min(min) {
    asset(min, 'Date', 'min expected a date')

    if (this._max) {
      asset(
        min,
        (val) => relateDate(val, this._max) === -1,
        `min scope expected a date before ${formatDate(
          this._max
        )}, but got a ${formatDate(data)}`
      )
    }

    this._min = min

    this.addValidator({ name: 'Min', validator: this._validateMin.bind(this) })

    return this
  },
  max(max) {
    asset(max, 'Date', 'max expected a date')

    if (this._min) {
      asset(
        max,
        (val) => relateDate(val, this._min) === 1,
        `max scope expected a date after ${formatDate(this._min)}, but got a ${formatDate(
          max
        )}`
      )
    }

    this._max = max

    this.addValidator({ name: 'Max', validator: this._validateMax.bind(this) })

    return this
  },
  _validateMin(data) {
    if (this._min === undefined) return

    if (relateDate(data, this._min) === -1) {
      return new ValidateError({
        message: `expected a date after ${formatDate(
          this._min
        )}, but got a ${formatDate(data)}`,
      })
    }
  },
  _validateMax(data) {
    if (this._max === undefined) return

    if (relateDate(data, this._max) === 1) {
      return new ValidateError({
        message: `expected a date before ${formatDate(
          this._max
        )}, but got a ${formatDate(data)}`,
      })
    }
  },
}

const enumMixin = {
  enum(arr) {
    asset(arr, 'Array', 'enum expected a array')

    // validate enum value
    if (isFunction(this.check)) {
      const err = this.test(...arr)

      if (err) throw err
    }

    this._enum = arr

    this.addValidator({
      name: 'Enum',
      validator: this._validateEnum.bind(this),
    })

    return this
  },
  _validateEnum(data) {
    if (this._enum === undefined) return

    if (!this._enum.includes(data)) {
      return new ValidateError({
        message: `expected a data value at ${this._enum}, but got a ${data}`,
      })
    }
  },
}

const parttenMixin = {
  partten(reg) {
    asset(reg, 'Partten', 'partten expected a reg')

    this._partten = reg

    this.addValidator({
      name: 'Partten',
      validator: this._validatePartten.bind(this),
    })

    return this
  },
  _validatePartten(data) {
    if (this._partten === undefined) return
    if (!['String', 'Number'].includes(this._type)) return

    if (!this._partten.test(data)) {
      return new ValidateError({
        message: `expected a data match partten: /${this._partten.source}/${this._partten.flags}`,
      })
    }
  },
}

module.exports = {
  rangeMixin,
  enumMixin,
  parttenMixin,
  dateRangeMixin,
}
