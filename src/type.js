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

function isOb(...objs) {
  return objs.every((obj) => inType(obj, [{}, []]))
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

function isUndef(...objs) {
  return isType(...objs, undefined)
}

function isReg(...objs) {
  return isType(...objs, /d/)
}

function isNil(...objs) {
  return objs.every((obj) => inType(obj, [undefined, null]))
}

function isFunction(...objs) {
  return objs.every((obj) => isType(obj, () => {}))
}

function isAsyncFunction(...objs) {
  return objs.every((obj) => isType(obj, async() => {}))
}

function isFunc(...objs) {
  return objs.every((obj) => inType(obj, [() => {}, async() => {}]))
}

function isDate(...objs) {
  return objs.every((obj) => isType(obj, new Date()))
}

const types = [
  'Object',
  'Array',
  'Ob',
  'Boolean',
  'String',
  'Number',
  'Symbol',
  'Promise',
  'NaN',
  'Nil',
  'Undef',
  'Reg',
  'Function',
  'AsyncFunction',
  'Func',
  'Date'
]

module.exports = {
  whatType,
  isType,
  inType,

  isArray,
  isBoolean,
  isFunc,
  isFunction,
  isAsyncFunction,
  isNaN,
  isNil,
  isNumber,
  isString,
  isSymbol,
  isUndef,
  isObject,
  isOb,
  isNull,
  isPromise,
  isReg,
  isDate,

  types
}
