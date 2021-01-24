const baseTypes = {
  'Boolean': true,
  'String': 'string',
  'Number': 1,
  'Symbol': Symbol(),
  'Promise': Promise.resolve(),
  'NaN': NaN,
  'Undefined': undefined,
  'Partten': /s/,
  'SyncFunction': () => { },
  'AsyncFunction': async () => { },
  'Date': new Date(),
  'Set': new Set(),
  'Object': {},
  'Array': []
}

module.exports = {
  baseTypes
}