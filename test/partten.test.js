const types = require('../v2/type')

const { string } = types

const { baseTypes } = require('./types')

const reg = /abc/

test(`pattern mixin only extend by string and number`, () => {
  for (const type in baseTypes) {
    const t = types[type.toLowerCase()]

    if (!['String', 'Number'].includes(type)) {
      expect(() => {
        t().pattern()
      }).toThrow()
    }
  }
})

test(`set pattern of string`, () => {
  expect(string()._pattern).toBe(undefined)
  expect(string().pattern(reg)._pattern).toBe(reg)
  expect(() => {
    string().pattern('')
  }).toThrow()
})

test(`validate pattern of string`, () => {
  expect(string().pattern(reg).check('')).toBe(false)
  expect(string().pattern(reg).check('abc')).toBe(true)
})
