const type = require('./type')
const proto = require('./proto')
const error = require('./error')
const { allValidates, getValidateByType, asset } = require('./validate')

const { defineUnEnumerableProperty, removeEmpty } = require('./helper')

module.exports = {
  ...type,
  ...proto,
  ...error,
  ...allValidates,
  
  getValidateByType,
  asset,
  defineUnEnumerableProperty,
  removeEmpty,
}
