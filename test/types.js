const baseTypes = {
  'boolean': true,
  'string': 'string',
  'number': 1,
  'symbol': Symbol(),
  'promise': Promise.resolve(),
  'nan': NaN,
  'undefined': undefined,
  'regexp': /s/,
  'syncfunction': () => { },
  'asyncfunction': async () => { },
  'date': new Date(),
  'set': new Set(),
  'object': {},
  'array': []
}

module.exports = {
  baseTypes
}