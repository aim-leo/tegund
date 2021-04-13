<p align="center">
  <img width="320" :src="$withBase('/logo.svg')">
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

## Installation and use

```bash
# Install tegund
npm i tegund
```

## API

### Validator
**Validator** is a collection of functions for verifying the most basic data types, including:

- `isString`

**Purpose**: used to verify whether the input value is a string

**Parameter**: Accept multiple values ​​to be verified, and return `true` when all parameters are verified

**Instructions**:

```javascript
const { isString } = require('tegund')

isString('a') // true
isString('a', 1) // false
isString('a','b') // true
```

Similar validators include:
- `isArray` Is an array
- `isBoolean` Is a Boolean value
- `isFunction` Is a function
- `isSyncFunction` Is a synchronous function
- `isAsyncFunction` Is an asynchronous function

```javascript
isSyncFunction(function() {}) // true
isSyncFunction(() => {}) // true
isSyncFunction(async () => {}) // false

isAsyncFunction(async () => {}) // true

isFunction(() => {}) // true
isFunction(async () => {}) // true
```
- `isNaN` Is a NaN
- `isNumber` Is a number
- `isInteger` Is an integer
- `isFloat` Is a floating point number
- `isSymbol` Is a Symbol
- `isUndefined` Is undefined
- `isObject` Is an Object
- `isNull` Is null
- `isPromise` Is a Promise
- `isRegExp` Is a regular expression
- `isDate` Is a Date
- `isSet` Is a Set
- `isEmpty` If the detection value is ‘’ 0 undefined null NaN, return true
```javascript
isEmpty('', 0, null, undefined, NaN) // true
```

### Types
**Types** are used to verify more complex scenarios. We provide a series of types. These types are actually a `function`, and the return value is a `T` object, which will be discussed in the following document

#### Basic Type
The basic type has only a single type and no subtypes.
All built-in basic types are:
- `string`

**Purpose**: used to verify whether the input value is a string

**Instructions**:
```javascript
const {string} = require('tegund')

const stringT = string() // you will got a stringT, which instanceof T
// then validate
stringT.check('a','b')
```
As you might expect, we also have the following basic types:
- `boolean`
- `function` To avoid naming conflicts, you can also use `func` instead
- `syncfunction`
- `asyncfunction`
- `nan`
- `number`
- `integer`
- `float`
- `symbol`
- `undefined` To avoid naming conflicts, you can also use `undef` instead
- `null`
- `promise`
- `regexp`
- `date`
- `set`
- `empty`

#### Composite type
The composite type allows the definition of the type of the child element. With the composite type, we can verify more complex scenarios:
- `array`
``` javascript
// When no validator element is needed, no value is passed
array()

// Assuming that the child elements are all strings
// You can pass in a string() as a parameter
array(string())
// or use alias
array('string')

// Assuming that the content of the child element can be a string or number, multiple types can be passed in
array(string(), number()) // or array('string','number')

// Assuming that the first item of the array is a string and the second item is a number, then an array is passed in
array([string(), number()])

// or
array(['string','number'])
```
- `object`
The object type is used to define a collection

``` javascript
// When there is no need to verify the properties of the passed in object
object()

// Suppose you want the object to have a name attribute of type string
object({
  name: string()
})
// or use alias
object({
  name:'string'
})

// Suppose there is a more complex scenario, such as wishing to have an attribute a, which is an object, and this object contains a string type attribute b
object({
  a: object({
    b: string()
  })
})
// This is a bit ugly, we can also omit the second-level object
object({
  a: {
    b:'string'
  }
})
```

#### Special Type

- `at`
**at** is used to create more complex scenes, sometimes we hope to support multiple types at the same time
``` javascript
// For example, the value you want to enter can be a string or a number
at(string(), number())
// use alias
at('string','number')
```

- `notat`
**notat** is the opposite, which means neither
``` javascript
// For example, the value you want to enter is neither a string nor a number
notat(string(), number())
// use alias
notat('string','number')
```

- `any`
**any** can be used to match any type
``` javascript
// Usually used as a station symbol, for example, you want an object to have an attribute a, but you don’t care about the specific value of the attribute a
object({
  a: any()
})
```

- `never`
**never** is used to match a type that does not exist
``` javascript
// Usually used as a station symbol, for example, you don't want the object to have a attribute
object({
  a: never()
})
```

### Prototype
As the above document says, we use type function calls to get the type. In fact, after each function call above, we get a built-in prototype object:

#### `T`

> In typescript, T is generally regarded as a generic type. Tegund's T does not have this meaning, it is just a very ordinary class

Construct a blank type object:
```javascript
const { T } = require('tegund')
const t = new T()

t.check('') // true
```
##### Example method
check:
- `test(data1, data2...)` is used to verify the provided data, and a `ValidateError` is returned when the verification fails
- `check(data1, data2...)` is used to verify the provided data, and returns `false` when the verification fails
- `assert(data1, data2...)` assertion, used to verify the provided data, and throw a `ValidateError` when the verification fails

The following methods support chained calls, that is, always return the current object T
- `forbid(flag)` whether the field is forbidden to enter, the flag defaults to `true`, when `false` is passed in, it means not forbidden, and the current object is returned
- `instance(parent)` Whether is an instance of parent, return the current object
```javascript
const {T} = require('tegund')
const t = new T()

t.instance(Error)

t.check('') // false
t.check(new Error()) // true
```

- `or(t)` or, return the current object
```javascript
const t = string().or(number())

t.check('') // true
t.check(1) // true
t.check(true) // false
```

- `addValidator(v)` adds a custom validator, if a validator with the same name already exists, it will overwrite it and return the current object

parameter:
```javascript
// v must be an object with validator attributes, name and message are optional
object({
 name: string().optional(),
 message: string().optional(),,
 validator: func()
})
```

Eg:
```javascript
const t = new T()

t.addValidator({
  name:'stringEqualTo1',
  validator: val => val === '1',
  message:'val expected equal to "1"'
})

t.test('') // ValidateError val expected equal to "1"
t.check('1') // true
```

- `removeValidator(vname)` removes the custom validator based on the name and returns the current object

Continue the previous example:
```javascript
t.removeValidator('stringEqualTo1')

t.test('') // undefined
```

- `optional(falg)` Whether is optional, flag defaults to `true`
- `enum(list)` Is in the list range
```javascript
const t = string().enum(['a','b'])
t.check('') // false
t.check('a') // true
```
- `clone()` clones the current object and returns an unrelated object T that is consistent with the current object
```javascript
const t = string().min(3)
t.check('') // false

const t2 = t.clone().min(0)
t.check('') // true
```

#### `ArrayT`
**ArrayT** is used to create the array form is the check type, which inherits from `T`
```javascript
array() instanceof ArrayT // true
// usage
const arrayT = new ArrayT(string(), number())
```

#### `ObjectT`
**ObjectT** is used to create the object form is the check type, which inherits from `T`
```javascript
object() instanceof ObjectT // true
// usage
const objectT = new ObjectT({
  name: string()
})
```
##### Example method
- `strict(flag)` detects whether the object has attributes outside the defined scope
```javascript
const t = object({ a: string() })
t.check({ a:'abc', b: 1 }) // true

t.strict()
t.check({ a:'abc', b: 1 }) // false
```

- `testProvided(data1, data2...)` only detects the attributes provided by the object
```javascript
const t = object({ a: string(), b: number() })
t.test({ a:'abc' }) // can not pass

t.testProvided({ a:'abc' }) // pass, will ignore b, because it wasn't provided
```

- `extend(t1, t2...)` inherits the properties of other ObjectT
```javascript
const baseSchema = object({
  id: integer(),
  name: string().min(3).max(20),
  createTime: date(),
  updateTime: date()
})

const postMixinSchema = object({
  content: string().min(10).max(5000)
})

// the postSchema will have all of baseSchema and postMixinSchema's props
const postSchema = object().extend(baseSchema, postMixinSchema)
```

#### `AtT`
**AtT** is used to create multiple possible types of types, which inherit from `T`
#### `NotAtT`
**NotAtT** is used to create a variety of possible forms of types, it inherits from `AtT`
#### `NeverT`
**NeverT** is used to create multiple possible types of types, it inherits from `T`

### Modifiers
Tegund supports chained calls, that is, every method except verification returns the object itself by default, which makes tegund very intuitive and easy to assemble.
In addition to basic type checking, tegund also supports many built-in modifiers, which also return the current object:
#### String
- `min(num, errorMessage)` minimum length
- `max(num, errorMessage)` maximum length
- `length(num, errorMessage)` length
- `pattern(p, errorMessage)` adds regular verification, whether it can pass the verification of regular p
-whether `contain(str, errorMessage)` contains str fragments
 
- `numeric()` pure numeric characters
- `alpha()` pure alphabetic characters
- `alphaNumeric()` pure numbers plus alphabetic characters
- `hex()` pure hexadecimal characters
- `base64()` base64 characters

#### Number
- `min(num, errorMessage)` minimum value
- `max(num, errorMessage)` maximum value
- `pattern(p, errorMessage)` adds regular check
 
- `positive()` positive numbers
- `negative()` negative numbers

#### Date
- `min(date, errorMessage)` minimum date
- `max(date errorMessage)` maximum date

#### Array
- `min(num, errorMessage)` minimum array length
- `max(num, errorMessage)` maximum array length
- `length(num, errorMessage)` array length

### Error
tegund has a built-in `ValidateError`, which inherits from the `Error` object
```javascript
const {ValidateError, string} = require('tegund')

string().test(1) instanceof ValidateError // true
```

### Custom Type
Any type will return a type object after additional processing, and this object itself is a new type.
However, you may want to define a global type so that it can be used directly anywhere. Or, you want to use the alias of the object instead of the object. In this case, we recommend you to customize the type.

tegund has a built-in `defineType` method that allows you to customize or overwrite existing types:
```javascript
const {defineType, string} = require('tegund')

// create a string type, which length must gte than 10, and named'longText'
const longText = defineType('longText', () => string().min(10))

// you can use it right now
longText.test('') // false

// or use it's alias
const t = object({
  content:'longText'
})
t.test({})
```
>You must define the type before it is used, that is, it must be placed at the entrance of the program, otherwise tegund cannot find the object

Using `defineType` can also override the built-in types, but this is not recommended


## License

[MIT](https://github.com/aim-leo/tegund/blob/master/LICENSE)

Copyright (c) 2021-present aim-leo