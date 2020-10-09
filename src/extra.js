const { isString, isArray, isObject } = require('./type')

function isEmptyString(...objs) {
  return isString(...objs) && objs.every(item => item === '')
}

function isEmptyArray(...objs) {
  return isArray(...objs) && objs.every(item => item.length === 0)
}

function isEmptyObject(...objs) {
  return isObject(...objs) && objs.every(item => Object.keys(item).length === 0)
}

module.exports = {
  isEmptyString,
  isEmptyArray,
  isEmptyObject
}
