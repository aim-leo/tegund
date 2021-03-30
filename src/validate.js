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
  return isNumber(...objs) && objs.every((obj) => obj % 1 === 0)
}

function isFloat(...objs) {
  return isNumber(...objs) && objs.every((obj) => obj % 1 !== 0)
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

function isRegExp(...objs) {
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
  return objs.every((obj) => isType(obj, new Date()) && !isNaN(obj.getTime()))
}

function isSet(...objs) {
  return objs.every((obj) => isType(obj, new Set()))
}

function isEmpty(...objs) {
  return objs.every(
    (obj) =>
      obj === '' ||
      obj === 0 ||
      obj === undefined ||
      obj === null ||
      Number.isNaN(obj)
  )
}

const baseTypes = [
  'Boolean',
  'String',
  'Number',
  'Symbol',
  'Promise',
  'NaN',
  'Undefined',
  'RegExp',
  'Function',
  'SyncFunction',
  'AsyncFunction',
  'Date',
  'Set'
]

const sugerTypes = ['Float', 'Integer', 'Empty']

const stuctTypes = ['Object', 'Array']

const allTypes = [...baseTypes, ...sugerTypes, ...stuctTypes]

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
  isRegExp,
  isDate,
  isSet,
  isEmpty
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
  return validate.name.replace('is', '')
}

function assert(obj, validator, message) {
  if (isFunction(validator)) {
    if (!validator(obj)) {
      throw new Error(message || 'validate error')
    }

    return
  }

  if (isString(validator)) validator = [validator]

  if (isArray(validator)) {
    for (const item of validator) {
      if (!isString(item)) {
        throw new Error(
          'assert validator expected a string array | string | function'
        )
      }

      const v = getValidateByType(item)

      if (v(obj)) {
        return
      }
    }

    throw new Error(
      message ||
        `obj expected a ${validator.join(' | ')} type, but got a ${whatType(
          obj
        )}`
    )
  }

  throw new Error(
    'assert validator expected a string array | string | function'
  )
}

module.exports = {
  whatType,
  isType,
  inType,

  allValidates,
  ...allValidates,

  baseTypes,
  sugerTypes,
  stuctTypes,
  allTypes,

  getValidateByType,
  getValidateType,

  assert
}
