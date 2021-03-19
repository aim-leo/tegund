const { array, string, object, any, boolean } = require('./src/type.js')

// const t = object({
//   override: any().optional(),
//   exclude: array(string()),
//   include: array(string()).optional()
// })
// // console.log(
// //   t
// // )

// console.log(
//   t.test({
//     exclude: [true]
//   })
// )

const t = array(
  [
    string().optional(),
    boolean()
  ]
)

console.log(t.test([]))