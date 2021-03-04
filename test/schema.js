const md5 = require('md5')

const { ObjectId } = require('mongodb')

const { MongoSchema, MongoObjectT } = require('../mongund/proto')
const { string, number, id, ids } = require('../mongund/type')

// const schema = new MongoObjectT({
//   name: string().min(3).max(10).unique(),
//   type: number().enum([1, 2, 3]).default(1), // 1 admin 2 editor 3 user
//   pwd: string()
//     .exclude()
//     .set((val) => {
//       // it will be save at db, when modify, if changed, will auto update it
//       if (val && typeof val === 'string') return md5(val)
//     }),
//   province: string(),
//   city: string(),
//   county: string(),
//   addressDetail: string(),
//   fullAddress: string().get((val, doc) => {
//     // it will not be saved
//     return doc.province + doc.city + doc.county + doc.addressDetail
//   }),
//   category: id().ref('category').autoJoin(), // relate with other table
//   // tag: ids().ref('tag'),
// })

// ;(async () => {
//   console.log(await schema.perfect({
//     name: '123',
//     pwd: '123456',
//     province: '江西省',
//     city: '赣州市',
//     county: '兴国县',
//     addressDetail: '永丰乡'
//   }))
// })()

console.log(id().test(ObjectId('60472a896d78e102d2ea8661')))