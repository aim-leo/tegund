const { isString, whatType } = require('./validate')

class ValidateError extends Error {
  constructor({ message = 'Validate error!', source } = {}) {
    super(message)

    if (!isString(message)) {
      console.error('message expected a string')
    }
    this.message = message
    this.source = source
    this.name = 'ValidateError'
  }
}

class ValidateTypeError extends ValidateError {
  constructor({ type, message, field, ...args } = {}) {
    super(args)

    this.type = type
    this.name = 'ValidateTypeError'
    this.message = `${field ? field + 'is' : ''}expected a ${type} type, got a ${whatType(this.source)}`
  }
}

module.exports = {
  ValidateError,
  ValidateTypeError
}
