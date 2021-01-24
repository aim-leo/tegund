const {
  at,
  string,
  number,
  notat,
  any,
  empty,
  object,
  array,
  never
} = require('../v2/type')

// console.log(string().length(1).test('222'))
// console.log(string().length(1).test('1'))
// console.log(number().length(1).test('222'))
// console.log(string().partten(/abc/).optional(true).test(undefined))


console.log(
  object({
    a: string(),
    b: number().optional(),
    c: never()
  }).test({
    a: '',
    c: 1
  })
)

// console.log(string().test(1))
// console.log(object({ a: string() }).test({ a: 2 }))
// console.log(at(string(), number()).test(true))
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

// console.log(array().check())
// console.log(array(number()).check([1]))
// console.log(array(number()).check([1, '']))
// console.log(array(number(), string()).check([1, '']))
// console.log(
//   array(
//     object({
//       a: string(),
//     })
//   ).check([{ a: '' }])
// )
// console.log(
//   object({
//     a: notat('String')
//   }).check({ a: '' })
// )
// // console.log(
// //   object({
// //     a: notat(
// //       object({
// //         b: 'String'
// //       })
// //     )
// //   }).check({ a: { b: 1 } })
// // )
// // console.log(array(string(), number()).check())


// console.log(
//   object({
//     a: string()
//   }).check({
//     a: 1
//   })
// )

// console.log(
//   notat(
//     string(),
//     number()
//   ).check(undefined)
// )

// console.log(
//   notat(
//     object(
//       {
//         a: object()
//       }
//     )
//   ).check({
//     a: 1
//   })
// )

// console.log(
//   object({
//     a: notat(
//       object({
//         b: 'Number'
//       })
//     )
//   }).check({ a: { b: 1 } })
// )

// console.log(
//   at(
//     string(),
//     number()
//   ).check(true)
// )

// console.log(
//   string().check()
// )

// const Validator = require("fastest-validator");
 
// const v = new Validator()

