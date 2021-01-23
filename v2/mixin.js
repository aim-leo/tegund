const { ValidateError } = require('./error')

const { asset } = require('./validate')

const rangeValidateMixin = {
  length(length) {
    if (this._length !== undefined) {
      throw new Error('Can not reset length prop')
    }
    asset(length, 'Integer', 'length expected a integer')
    asset(length, (val) => val > 0, 'length expected a integer gte then 0')

    this._length = length

    // add a validator
    this.validate(this._validateLength.bind(this))

    return this
  },
  min(min) {
    if (this._min !== undefined) {
      throw new Error('Can not reset min prop')
    }
    console.log('min', min)
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

    this.validate(this._validateMin.bind(this))

    return this
  },
  max(max) {
    if (this._max !== undefined) {
      throw new Error('Can not reset min prop')
    }
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

    this.validate(this._validateMax.bind(this))

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

module.exports = {
  rangeValidateMixin,
}
