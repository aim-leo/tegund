const { at, string, number, notat, any, empty } = require('../src/type')

const { baseTypes } = require('./types')

for (const type in baseTypes) {
  test(`checking ${type} type is any`, () => {
    expect(any().check(baseTypes[type])).toBe(true);
  })
}

test('checking 0 is empty', () => {
  expect(empty().check(0)).toBe(true);
})

test('checking "" is empty', () => {
  expect(empty().check('')).toBe(true);
})

test('checking null is empty', () => {
  expect(empty().check(null)).toBe(true);
})

test('checking undefined is empty', () => {
  expect(empty().check(undefined)).toBe(true);
})

const baseTypesList = Object.keys(baseTypes)

function shuffle(arr) {
  return arr
    .map(i => ({ v: i, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(item => item.v)
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// random test at
for (let i = 0; i < 100; i++) {
  const arr = shuffle(baseTypesList).slice(0, randomInt(1, baseTypesList.length))

  const testType = baseTypesList[randomInt(0, baseTypesList.length - 1)]
  const data = baseTypes[testType]

  test(`checking ${testType} type at ${arr}`, () => {
    expect(at(...arr).check(data)).toBe(arr.includes(testType));
  })

  test(`checking ${testType} type not at ${arr}`, () => {
    expect(notat(...arr).check(data)).toBe(!arr.includes(testType));
  })
}
