const types = require('../v2/type')

const { string } = types

const { baseTypes } = require('./types')

const reg = /abc/

test(`partten mixin only extend by string and number`, () => {
  for (const type in baseTypes) {
    const t = types[type.toLowerCase()]

    if (!['String', 'Number'].includes(type)) {
      expect(() => {
        t().partten()
      }).toThrow()
    }
  }
})

test(`set partten of string`, () => {
  expect(string()._partten).toBe(undefined)
  expect(string().partten(reg)._partten).toBe(reg)
  expect(() => {
    string().partten('')
  }).toThrow()
})

test(`validate partten of string`, () => {
  expect(string().partten(reg).check('')).toBe(false)
  expect(string().partten(reg).check('abc')).toBe(true)
})
