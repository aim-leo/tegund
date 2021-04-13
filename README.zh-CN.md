<p align="center">
  <img width="320" src="https://aim-leo.github.io/tegund/logo.svg">
</p>


<h3 align="center" style="text-align: center">
  简单易用的javascript类型校验工具
</h3>

<br/>
<br/>
<br/>

简体中文 | [English](./README.md)

## 简介

**tegund**是一个非常简单直观的javascript类型检验库。特点概述:

*   **体积小** : 完整的大小只有4.9kb (gzip压缩后)，不依赖其他第三方库；
*   **类型丰富** : 提供数十种基本类型；
*   **易扩展** : 允许您在基本类型中分化出新的类型；

***

## 示例
基本使用
```javascript
const { object, string, number, integer, date, array } = require('tegund')

// basic type check
string().check('abc') // true
number().check(true) // false

// addtional condition
string().min(5).check('abc')  // false

// object
object().check({}) // true
object().check([]) // false

// group
const group = object({
  name: string(),
  age: 'integer'  // use alias, equal to integer()
})

group.check({}) // false
group.check({ name: 'leo', age: 18 }) // true

// array
array().check([1, 'abc', true]) true

// typed array
array(string()).check(['abc', 1]) // false
// or use alias
array('string').check(['abc', 1]) // false

// a array containe string or number
array('string', 'number').check(['abc', 1]) // true

```
下面我们用tegund校验更加复杂的场景。
假设我们要创建一张用户表，使用tegund来校验输入的内容：

```javascript
const { object, string, integer, date, array } = require('tegund')

const interface = object({
  name: string().min(2).max(10),  // the user name must be a string and at 2-10
  age: integer().positive(),  // age must be a positive integer number
  address: object({  // the address is a object
	province: string(),
	city: 'string',  // use alias, it is same at string()
	county: 'string',
	addressDetail: 'string',
  }),
  email: string().pattern(  // you can add addtional pattern and error message
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    'Please enter a correct email address'
  ),
  pwd: string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    'Please enter a password with more than 8 digits, including numbers and letters'
  ),
  tag: array('string'),  // tag must be a array<string>
  remark: string().optional(),  // this field is optional
  createTime: date().forbid(),  // can not provide a createTime prop
  updateTime: date().forbid(),
})

// then validate the params
const args = {}
// test it, is pass, get a undefined, if not, will get a ValidateError
const err = interface.test(args)
// if pass, will get a true
const passed = interface.check(args)

// or you can use assert
// if not pass, will throw a error
interface.assert(args)
```
错误信息：
```javascript
>>>>> interface.assert()
<<<<< ValidateError: None is not a Object type

>>>>> interface.assert({})
<<<<< ValidateError: field name validate error, expected a String type, got a [object Undefined]

>>>>> interface.assert({name: ''})
<<<<< ValidateError: field name validate error, expected a String, length gte than 2, but got a length: 0

>>>>> interface.assert({name: 'leo'})
<<<<< ValidateError: field age validate error, expected a Integer type, got a [object Undefined]

// and so on...
```

详细的使用方法，请查看[说明文档](https://aim-leo.github.io/tegund/README.zh-CN.html) 

## 安装使用

```bash
# 安装 tegund
npm i tegund
```


## License

[MIT](https://github.com/aim-leo/tegund/blob/master/LICENSE)

Copyright (c) 2021-present aim-leo