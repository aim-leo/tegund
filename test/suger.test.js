const { any, never, object, string, empty } = require('../v2/type');

const { baseTypes } = require('./types')

test(`test any type`, () => {
  for (const key in baseTypes) {
    expect(any().check(baseTypes[key])).toBe(true)
  }
});

test(`test never type`, () => {
  for (const key in baseTypes) {
    expect(never().check(baseTypes[key])).toBe(false)
  }

  expect(never().check()).toBe(true)
});

test(`test never type as a object value`, () => {
  expect(
    object({
      a: string(),
      b: never()
    }).check({
      a: '',
      b: '',
    })
  ).toBe(false)

  expect(
    object({
      a: string(),
      b: never()
    }).check({
      a: '',
    })
  ).toBe(true)
});

test(`test empty type`, () => {
  for (const key in baseTypes) {
    expect(empty().check(baseTypes[key])).toBe(!baseTypes[key])
  }
});