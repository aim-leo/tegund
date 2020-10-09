const type = require('./type')
const typedArray = require('./typed-array')
const asset = require('./asset')
const extra = require('./extra')

module.exports = {
  ...type,
  ...typedArray,
  ...asset,
  ...extra
}
