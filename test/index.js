const {
  at,
  string,
  number,
  notat,
  any,
  empty,
  object,
  array,
} = require('../v2/type')

// console.log(object().check({}))
// console.log(object({ a: string(), b: number() }).check({ a: '', b: 1, c: 2 }))
// console.log(object({ a: object({ b: string() }) }).check({ a: { b: ''} }))
// console.log(
//   object({
//     b: string(),
//     c: object({
//       d: number()
//     })
//   })
// )

// console.log(
//   object({
//     b: 'String',
//     c: object({
//       d: 'Number'
//     })
//   })
// )

console.log(array().check())
console.log(array(number()).check([1]))
console.log(array(number()).check([1, '']))
console.log(array(number(), string()).check([1, '']))
console.log(
  array(
    object({
      a: string(),
    })
  ).check([{ a: '' }])
)
// console.log(array(string(), number()).check())
