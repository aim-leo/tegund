const { boolean } = require('../src/type')

test(`test boolean convert`, () => {
  const ts = [1, '1', {}, []]
  const fs = [0, '', null, undefined, NaN]

  for (const t of ts) {
    expect(boolean().check(t)).toBe(false)
    expect(boolean().convert().check(t)).toBe(true)
  }

  for (const f of fs) {
    expect(boolean().check(f)).toBe(false)
    expect(boolean().convert().check(f)).toBe(true)
  }
})
