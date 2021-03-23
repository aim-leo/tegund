const { string } = require('../src/type')

test(`test string numeric`, () => {
  const val = 'abc'
  expect(string().check(val)).toBe(true)
  expect(string().numeric().check(val)).toBe(false)
})

test(`test string alpha`, () => {
  const val = '121abc'
  expect(string().check(val)).toBe(true)
  expect(string().alpha().check(val)).toBe(false)
})

test(`test string alphaNumeric`, () => {
  const val = '121abc-'
  expect(string().check(val)).toBe(true)
  expect(string().alphaNumeric().check(val)).toBe(false)
})

test(`test string hex`, () => {
  expect(string().hex().check('FFFFFF')).toBe(true)
  expect(string().hex().check('333333')).toBe(true)
  expect(string().hex().check('GGGGGG')).toBe(false)
})

test(`test string base64`, () => {
  expect(string().base64().check('1342234')).toBe(false)
  expect(string().base64().check('afQ$%rfew')).toBe(false)
  expect(string().base64().check('dfasdfr342')).toBe(false)
  expect(string().base64().check('uuLMhh')).toBe(false)

  expect(string().base64().check('uuLMhh==')).toBe(true)
})

test(`test string contain`, () => {
  expect(string().contain('a').check('1342234')).toBe(false)
  expect(string().contain('a').check('afQ$%rfew')).toBe(true)
  expect(string().contain('2234').check('1342234')).toBe(true)
})

test(`test string convert`, () => {
  expect(string().check(123)).toBe(false)
  expect(string().convert().check(123)).toBe(true)
})
