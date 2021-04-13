<p align="center">
  <img width="320" src="https://aim-leo.github.io/tegund/logo.svg">
</p>


<h3 align="center" style="text-align: center">
  Simple and easy-to-use JavaScript type verification tool
</h3>

<br/>
<br/>
<br/>

English | [简体中文](./README.zh-CN.md)

## Introduction

**tegund** is a very simple and intuitive JavaScript type checking library. Features overview:

* **Small size**: The complete size is only 4.9kb (after gzip compression), and does not rely on other third-party libraries;
* **Rich types**: Provide dozens of basic types;
* **Easy to expand**: Allows you to differentiate new types from basic types;

***

## Example
Basic use
```javascript
const {object, string, number, integer, date, array} = require('tegund')

// basic type check
string().check('abc') // true
number().check(true) // false

// addtional condition
string().min(5).check('abc') // false

// object
object().check({}) // true
object().check([]) // false

// group
const group = object({
  name: string(),
  age:'integer' // use alias, equal to integer()
})

group.check({}) // false
group.check({ name:'leo', age: 18 }) // true

// array
array().check([1,'abc', true]) true

// typed array
array(string()).check(['abc', 1]) // false
// or use alias
array('string').check(['abc', 1]) // false

// a array containe string or number
array('string','number').check(['abc', 1]) // true

```
Below we use tegund to verify more complex scenarios.
Suppose we want to create a user table and use tegund to verify the input:

```javascript
const {object, string, integer, date, array} = require('tegund')

const interface = object({
  name: string().min(2).max(10), // the user name must be a string and at 2-10
  age: integer().positive(), // age must be a positive integer number
  address: object({ // the address is a object
    province: string(),
    city:'string', // use alias, it is same at string()
    county:'string',
    addressDetail:'string',
  }),
  email: string().pattern( // you can add addtional pattern and error message
    /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    'Please enter a correct email address'
  ),
  pwd: string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    'Please enter a password with more than 8 digits, including numbers and letters'
  ),
  tag: array('string'), // tag must be a array<string>
  remark: string().optional(), // this field is optional
  createTime: date().forbid(), // can not provide a createTime prop
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
Error message:
```javascript
>>>>> interface.assert()
<<<<< ValidateError: None is not a Object type

>>>>> interface.assert({})
<<<<< ValidateError: field name validate error, expected a String type, got a [object Undefined]

>>>>> interface.assert({name:''})
<<<<< ValidateError: field name validate error, expected a String, length gte than 2, but got a length: 0

>>>>> interface.assert({name:'leo'})
<<<<< ValidateError: field age validate error, expected a Integer type, got a [object Undefined]

// and so on...
```

For detailed usage, please check the [Document](https://aim-leo.github.io/tegund/)

## Installation and use

```bash
# Install tegund
npm i tegund
```
## License

[MIT](https://github.com/aim-leo/tegund/blob/master/LICENSE)

Copyright (c) 2021-present aim-leo