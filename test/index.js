const { at, string, number, notat, any, empty } = require('../v2/type')

console.log(at(string(), number()).check(''))
console.log(at(string(), number()).check(1))
console.log(at(string(), number()).check(true))

console.log(notat(string(), number()).check(''))
console.log(notat(string(), number()).check(1))
console.log(notat(string(), number()).check(true))

console.log(any().check(''))
console.log(any().check(1))

console.log(empty().check(0))
console.log(empty().check(null))
console.log(empty().check(undefined))
console.log(empty().check(''))
