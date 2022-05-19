const type = require('../src/type')

test(`test null type`, () => {
  expect(type.null().check('123')).toBe(false)
  expect(type.null().check()).toBe(false)
  expect(type.null().check(null)).toBe(true)

  expect(type.nu().check(null)).toBe(true)

  expect(type.at('null').check('123')).toBe(false)
  expect(type.at('null').check()).toBe(false)
  expect(type.at('null').check(null)).toBe(true)

  expect(type.at('nu').check(null)).toBe(true)
})

test(`test undefined type`, () => {
  expect(type.undefined().check('123')).toBe(false)
  expect(type.undefined().check()).toBe(false)
  expect(type.undefined().check(null)).toBe(false)
  expect(type.undefined().check(undefined)).toBe(true)

  expect(type.undef().check(undefined)).toBe(true)


  expect(type.at('undefined').check('123')).toBe(false)
  expect(type.at('undefined').check()).toBe(false)
  expect(type.at('undefined').check(null)).toBe(false)
  expect(type.at('undefined').check(undefined)).toBe(true)

  expect(type.at('undef').check(undefined)).toBe(true)
})

test(`test nil type`, () => {
  expect(type.nil().check('123')).toBe(false)
  expect(type.nil().check()).toBe(false)
  expect(type.nil().check(null)).toBe(true)
  expect(type.nil().check(undefined)).toBe(true)

  expect(type.at('nil').check('123')).toBe(false)
  expect(type.at('nil').check()).toBe(false)
  expect(type.at('nil').check(null)).toBe(true)
  expect(type.at('nil').check(undefined)).toBe(true)
})
