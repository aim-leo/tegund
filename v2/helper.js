const { asset } = require('./validate')

function objectOverflow(target, source) {
  for (const key in target) {
    if (!(key in source)) {
      return key
    }
  }
}

function relateDate(date, targetDate) {
  asset(date, 'Date')
  asset(targetDate, 'Date')

  const dateTime = date.getTime()
  const targetDateTome = targetDate.getTime()

  return dateTime === targetDateTome ? 0 : (dateTime < targetDateTome ? -1 : 1)
}

function formatDate(date) {
  asset(date, 'Date')

  return date.toISOString()
}

function defineEnumerableProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: false,
    writable: true,
  })
}

module.exports = {
  objectOverflow,
  relateDate,
  formatDate,
  defineEnumerableProperty
}