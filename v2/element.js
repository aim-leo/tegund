const { string } = require('./type')

const mongoId = () =>
  string().pattern(
    /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
    '请输入一个个合格的mongoId'
  )

const shortText = () => string().min(1).max(30)
const text = () => string().min(3).max(1000)
const longText = () => string().min(3).max(100000)

const tel = () =>
  string().pattern(
    /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
    '请输入一个联系电话,支持固定电话|手机号'
  )
const phone = () =>
  string().pattern(
    /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    '请输入一个正确的手机号'
  )

const email = () =>
  string().pattern(
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    '请输入一个正确的邮箱地址'
  )

const pwd = () =>
  string().pattern(
    /^[a-zA-Z]\w{5,17}$/,
    '请输入一个6-18位的密码,需包含数字和字母'
  )

const strongPwd = () =>
  string().pattern(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
    '请输入一个8-20位的强密码,必须同时包含数字和大小写字母'
  )

module.exports = {
  mongoId,
  shortText,
  text,
  longText,
  tel,
  phone,
  email,
  pwd,
  strongPwd,
}
