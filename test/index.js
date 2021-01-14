const { at, string, number, notat, any, empty } = require('../v2/type')

console.log(at(string(), number()))
console.log(at("String", "Number"))

console.log(notat(string(), number()))
console.log(notat("String", "Number"))

// console.log(at("Undefined").check(undefined))
// console.log(at("Undefined", "String").check(undefined))
// console.log(at("Set","Object","Array","Partten","String","SyncFunction","NaN","Promise","Number","Symbol","Date","Boolean","AsyncFunction","Undefined").check(undefined))
// console.log(notat("Set","Symbol","Undefined","Object","Date","AsyncFunction","SyncFunction","NaN","Boolean").check(new Date()))


function a(...args) {
  console.log(args)
}

a(1)
a(1,2,3)
a([1,2,3])