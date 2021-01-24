const { string } = require('../v2/type')

// test function type
test(`set enum of string`, () => {
  expect(() => {
    string().enum()
  }).toThrow();

  expect(() => {
    string().enum('1')
  }).toThrow();

  expect(() => {
    string().enum(['1', 2])
  }).toThrow();

  const arr = ['1', '2']
  expect(string().enum(arr)._enum).toBe(arr);
});

test(`validate enum of string`, () => {
  expect(string().enum(['1', '2']).check('3')).toBe(false);
  expect(string().enum(['1', '2']).check('1')).toBe(true);
});