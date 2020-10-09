const typeLib = require('./type')

const { isFunction, isArray, types } = typeLib

function isTypedArray(obj, typedFunction) {
  if (!isFunction(typedFunction)) { throw new Error('typedFunction expected a function') }
  if (!isArray(obj)) return false

  return typedFunction(...obj)
}

const typedArrayValidators = {}

for (const type of types) {
  typedArrayValidators[`is${type}Array`] = obj => isTypedArray(obj, typeLib[type])
}

module.exports = {
  isTypedArray,
  ...typedArrayValidators
}
