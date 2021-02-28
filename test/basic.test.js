
const types = require('../v2/type')

const { baseTypes } = require('./types')

// test basic type
for (const indexKey in baseTypes) {
  const t = types[indexKey.toLowerCase()]

  for (const key in baseTypes) {
    const result = t().check(baseTypes[key])

    test(`checking ${key} type is a ${indexKey}, result: ${result}`, () => {
      expect(result === (indexKey === key)).toBe(true);
    });
  }
}

// test function type
test(`checking syncFunction type is a Function`, () => {
  expect(types.function().check(() => {})).toBe(true);
});

test(`checking asyncFunction type is a Function`, () => {
  expect(types.function().check(async () => {})).toBe(true);
});

// test integer float type
for (const key in baseTypes) {
  const testFloatResult = types.float().check(baseTypes[key])

  test(`checking ${key} type is a Float, result: ${testFloatResult}`, () => {
    expect(testFloatResult).toBe(false);
  });

  const testIntResult = types.integer().check(baseTypes[key])

  test(`checking ${key} type is a Integer, result: ${testIntResult}`, () => {
    expect(testIntResult).toBe(key === 'number');
  });
}