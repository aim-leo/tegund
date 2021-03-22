const type = require('./type')
const proto = require('./proto')
const error = require('./error')
const { allValidates, getValidateByType, assert } = require('./validate')

const { defineUnEnumerableProperty, removeEmpty } = require('./helper')

module.exports = {
  ...type,
  ...proto,
  ...error,
  ...allValidates,
  
  getValidateByType,
  assert,
  defineUnEnumerableProperty,
  removeEmpty,
}
