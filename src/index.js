const type = require('./type')
const proto = require('./proto')
const error = require('./error')

const { defineUnEnumerableProperty, removeEmpty } = require('./helper')

module.exports = {
  ...type,
  ...proto,
  ...error,
  defineUnEnumerableProperty,
  removeEmpty,
}
