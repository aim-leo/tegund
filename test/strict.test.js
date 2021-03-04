const types = require('../src/type')

const { object, string } = types

const { baseTypes } = require('./types')

test(`strict only defined at object`, () => {
  for (const type in baseTypes) {
    const t = types[type.toLowerCase()]

    if (type !== 'object') {
      expect(() => {
        t().strict()
      }).toThrow()
    }
  }
})

test(`set strict of object`, () => {
  expect(object()._strict).toBe(false)
  expect(object().strict()._strict).toBe(true)
  expect(() => {
    object().strict('')
  }).toThrow()
})

test(`validate strict of object`, () => {
  expect(
    object({
      a: string()
    }).check({
      a: '',
      b: ''
    })
  ).toBe(true)
  expect(
    object({
      a: string()
    })
    .strict()
    .check({
      a: '',
      b: ''
    })
  ).toBe(false)
})

test(`test provided`, () => {
  expect(
    object({
      name: string(),
      content: string()
    }).test({
      name: '',
    })
  ).not.toBe(undefined)
  expect(
    object({
      name: string(),
      content: string()
    }).testProvided({
      name: '',
    })
  ).toBe(undefined)
})