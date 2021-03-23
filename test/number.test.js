const { number } = require('../src/type')

test(`test number positive`, () => {
  const val = -1
  expect(number().check(val)).toBe(true)
  expect(number().positive().check(val)).toBe(false)
})

test(`test number negative`, () => {
  const val = 1
  expect(number().check(val)).toBe(true)
  expect(number().negative().check(val)).toBe(false)
})

test(`test number convert`, () => {
  const val = '123'
  expect(number().check(val)).toBe(false)
  expect(number().convert().check(val)).toBe(true)
})
