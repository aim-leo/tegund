function whatType(obj) {
  return Object.prototype.toString.call(obj)
}

function isType(...objs) {
  if (objs.length < 2) return false
  return objs.every((item) => whatType(item) === whatType(objs[0]))
}

function inType(params, list) {
  if (!isType(list, [])) {
    throw new Error(`list expect a ${whatType([])}`)
  }
  let flag = false
  for (const i in list) {
    if (isType(list[i], params)) {
      flag = true
      break
    }
  }
  return flag
}

function isObject(...objs) {
  return isType(...objs, {})
}

function isArray(...objs) {
  return isType(...objs, [])
}

function isBoolean(...objs) {
  return isType(...objs, true)
}

function isString(...objs) {
  return isType(...objs, '')
}

function isNumber(...objs) {
  return isType(...objs, 1) && !isNaN(...objs)
}

function isInteger(...objs) {
  return isNumber(...objs) && objs.every(obj => obj%1 === 0)
}

function isFloat(...objs) {
  return isNumber(...objs) && objs.every(obj => obj%1 !== 0)
}

function isSymbol(...objs) {
  return isType(...objs, Symbol('Symbol'))
}

function isPromise(...objs) {
  return isType(...objs, Promise.resolve())
}

function isNaN(...objs) {
  return objs.every((obj) => Number.isNaN(obj))
}

function isNull(...objs) {
  return isType(...objs, null)
}

function isUndefined(...objs) {
  return isType(...objs, undefined)
}

function isPartten(...objs) {
  return isType(...objs, /d/)
}

function isSyncFunction(...objs) {
  return objs.every((obj) => isType(obj, () => {}))
}

function isAsyncFunction(...objs) {
  return objs.every((obj) => isType(obj, async() => {}))
}

function isFunction(...objs) {
  return objs.every((obj) => inType(obj, [() => {}, async() => {}]))
}

function isDate(...objs) {
  return objs.every((obj) => isType(obj, new Date()))
}

function isSet(...objs) {
  return objs.every((obj) => isType(obj, new Set()))
}

function isEmpty(...objs) {
  return objs.every(obj => obj === '' || obj === 0 || obj === undefined || obj === null || Number.isNaN(obj))
}

const baseTypes = [
  'Boolean',
  'String',
  'Number',
  'Symbol',
  'Promise',
  'NaN',
  'Undefined',
  'Partten',
  'Function',
  'SyncFunction',
  'AsyncFunction',
  'Date',
  'Set'
]

const sugerTypes = [
  'Float',
  'Integer',
  'Empty'
]

const stuctTypes = [
  'Object',
  'Array'
]

const allTypes = [
  ...baseTypes,
  ...sugerTypes,
  ...stuctTypes
]

const allValidates = {
  isArray,
  isBoolean,
  isFunction,
  isSyncFunction,
  isAsyncFunction,
  isNaN,
  isNumber,
  isInteger,
  isFloat,
  isString,
  isSymbol,
  isUndefined,
  isObject,
  isNull,
  isPromise,
  isPartten,
  isDate,
  isSet,
  isEmpty,
}

function getValidateByType(type) {
  if (!isString(type)) {
    console.error('getValidateByType', type)
    throw new Error('type expected a string')
  }

  return allValidates['is' + type]
}

function getValidateType(validate) {
  if (!isFunction(validate)) {
    throw new Error('validate expected a function')
  }
  return validate.name.replace(
    'is',
    ''
  )
}

function asset(obj, validator, message) {
  if (isString(validator)) {
    const v = getValidateByType(validator)

    if (!v(obj)) {
      throw new Error(
        message ||
          `obj expected a ${validator} type, but got a ${whatType(obj)}`
      )
    }
  } else if (isFunction(validator)) {
    if (!validate(obj)) {
      throw new Error(message || 'validate error')
    }
  }
}

module.exports = {
  whatType,
  isType,
  inType,

  ...allValidates,

  baseTypes,
  sugerTypes,
  stuctTypes,
  allTypes,

  getValidateByType,
  getValidateType,

  asset
}
