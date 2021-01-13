const {
  boolean,
  object,
  array,
  string,
  notat,
  at,
  empty,
  any,
  never,
} = require('../v2/type')

console.log(boolean())
console.log(
  object({
    a: boolean(),
    b: object(),
    c: array(string()),
  })
)

console.log(notat(boolean(), string()))
console.log(at(boolean(), string()))
console.log(any())
console.log(empty())
console.log(never())
