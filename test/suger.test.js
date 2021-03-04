const {
  any,
  never,
  object,
  string,
  number,
  empty,
  array,
} = require('../src/type')

const { baseTypes } = require('./types')

test(`test any type`, () => {
  for (const key in baseTypes) {
    expect(any().check(baseTypes[key])).toBe(true)
  }
})

test(`test never type`, () => {
  for (const key in baseTypes) {
    expect(never().check(baseTypes[key])).toBe(false)
  }

  expect(never().check()).toBe(true)
})

test(`test never type as a object value`, () => {
  expect(
    object({
      a: string(),
      b: never(),
    }).check({
      a: '',
      b: '',
    })
  ).toBe(false)

  expect(
    object({
      a: string(),
      b: never(),
    }).check({
      a: '',
    })
  ).toBe(true)
})

test(`test empty type`, () => {
  for (const key in baseTypes) {
    expect(empty().check(baseTypes[key])).toBe(!baseTypes[key])
  }
})

test('test array every child', () => {
  expect(array().check([])).toBe(true)

  expect(array().check('')).toBe(false)

  expect(() => {
    array([]).check([])
  }).toThrow()

  expect(array([string()]).check([])).toBe(false)

  expect(array(['string']).check(['1'])).toBe(true)

  expect(array(['string', 'number']).check(['1', 1])).toBe(true)

  expect(array([string(), number()]).check(['1', true])).toBe(false)
})

test('test array struct', () => {
  expect(array(string()).check([])).toBe(true)
  expect(array(string()).check([1])).toBe(false)
  expect(array(string()).check(['1', 1])).toBe(false)
  expect(array(string()).check(['1', '2'])).toBe(true)

  expect(array('string', 'number').check([1])).toBe(true)
  expect(array(string(), number()).check(['1', 1])).toBe(true)
  expect(array(string(), number()).check(['1', '2'])).toBe(true)
})
