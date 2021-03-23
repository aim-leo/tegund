const { date } = require('../src/type')

test(`test date convert`, () => {
  expect(date().convert().check(new Date())).toBe(true)
  expect(date().convert().check(1616493495955)).toBe(true)
  expect(date().convert().check('2021-03-23T09:58:34.857Z')).toBe(true)

  expect(() => date().convert().assert('dasdadas')).toThrow()
})