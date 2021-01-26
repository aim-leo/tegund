const types = require('../v2/type')

const { string, array, date } = types

const { baseTypes } = require('./types')

test(`range mixin only extend by string and array`, () => {
  for (const type in baseTypes) {
    const t = types[type.toLowerCase()]

    expect(() => {
      t().min()
    }).toThrow()

    expect(() => {
      t().max()
    }).toThrow()

    if (!['String', 'Array'].includes(type)) {
      expect(() => {
        t().length()
      }).toThrow()

      expect(() => {
        t().min(1)
      }).toThrow()

      expect(() => {
        t().max(1)
      }).toThrow()
    }
  }
})

test(`set length of string`, () => {
  expect(string()._length).toBe(undefined)
  expect(string().length(1)._length).toBe(1)
  expect(() => {
    string().length(-1)
  }).toThrow()
})

test(`validate length of string`, () => {
  expect(string().length(2).check('')).toBe(false)
  expect(string().length(2).check('11')).toBe(true)
})

test(`validate length of array`, () => {
  expect(array().length(2).check([])).toBe(false)
  expect(array().length(2).check([1, 2])).toBe(true)
})

test(`set min max of string`, () => {
  expect(string()._min).toBe(undefined)
  expect(string().min(1)._min).toBe(1)
  expect(() => {
    string().min(-1)
  }).toThrow()

  expect(string()._max).toBe(undefined)
  expect(string().max(1)._max).toBe(1)
  expect(() => {
    string().max(-1)
  }).toThrow()

  // max must gte than min
  expect(() => {
    string().max(1).min(2)
  }).toThrow()
})

test(`validate min max of string`, () => {
  expect(string().min(2).check('')).toBe(false)
  expect(string().min(2).check('11')).toBe(true)

  expect(string().max(2).check('1111')).toBe(false)
  expect(string().max(2).check('11')).toBe(true)
})

test(`validate min max of array`, () => {
  expect(array().min(2).check([])).toBe(false)
  expect(array().min(2).check([1, 2, 3])).toBe(true)

  expect(array().max(2).check([1, 2, 3])).toBe(false)
  expect(array().max(2).check([1])).toBe(true)
})

test(`reset length of string`, () => {
  const t = string().length(2)
  expect(t.check('')).toBe(false)
  expect(t.check('11')).toBe(true)

  t.length(0)

  expect(t.check('')).toBe(true)
})


// date range validate
test(`validate date min max`, () => {
  const minDate = new Date('2000-01-26T14:07:30.971Z')
  const maxDate = new Date('2021-01-26T14:07:30.971Z')

  const t = date().min(minDate).max(maxDate)

  expect(
    t.check(
      new Date('1999-01-26T14:07:30.971Z')
    )
  ).toBe(false)

  expect(
    t.check(
      new Date('2030-01-26T14:07:30.971Z')
    )
  ).toBe(false)

  expect(
    t.check(
      new Date('2020-01-26T14:07:30.971Z')
    )
  ).toBe(true)
})