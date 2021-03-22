const { assert, isUndefined, isNull, isNaN, isArray } = require('./validate')

function objectOverflow(target, source) {
  for (const key in target) {
    if (!(key in source)) {
      return key
    }
  }
}

function relateDate(date, targetDate) {
  assert(date, 'Date')
  assert(targetDate, 'Date')

  const dateTime = date.getTime()
  const targetDateTime = targetDate.getTime()

  return dateTime === targetDateTime ? 0 : dateTime < targetDateTime ? -1 : 1
}

function formatDate(date) {
  assert(date, 'Date')

  return date.toISOString()
}

function defineUnEnumerableProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: false,
    writable: true
  })
}

function removeEmpty(
  obj,
  {
    removeUndefined = true,
    removeNull = true,
    removeNaN = false,
    removeEmptyString = false,
    removeEmptyArray = false,
    removeFalse = false
  } = {}
) {
  assert(obj, 'Object')

  const result = {}
  for (const key in obj) {
    const val = obj[key]
    if (removeUndefined && isUndefined(val)) {
      continue
    }

    if (removeNull && isNull(val)) {
      continue
    }

    if (removeNaN && isNaN(val)) {
      continue
    }

    if (removeEmptyString && val === '') {
      continue
    }

    if (removeEmptyArray && isArray(val) && val.length === 0) {
      continue
    }

    if (removeFalse && val === false) {
      continue
    }

    result[key] = val
  }

  return result
}

module.exports = {
  objectOverflow,
  relateDate,
  formatDate,
  defineUnEnumerableProperty,
  removeEmpty
}
