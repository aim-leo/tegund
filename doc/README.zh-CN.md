<p align="center">
  <img width="320" :src="$withBase('/logo.svg')">
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

## 安装使用

```bash
# 安装 tegund
npm i tegund
```

## API

### 校验器
**Validator**是一系列校验最基础数据类型的函数集合，包含了：
- `isString`

**用途**：用于校验输入的值是否是字符串
**参数**：可接受多个待校验的值，当所有参数都校验通过返回 `true`

**使用方法**：
```javascript
const { isString } = require('tegund')

isString('a') // true
isString('a', 1)  // false
isString('a', 'b') // true
```

类似的校验器还有：
- `isArray` 是否是数组
- `isBoolean`  是否是布尔值
- `isFunction`  是否是函数
- `isSyncFunction`  是否是同步函数
- `isAsyncFunction` 是否是异步函数

```javascript
isSyncFunction(function() {}) // true
isSyncFunction(() => {}) // true
isSyncFunction(async () => {}) // false

isAsyncFunction(async () => {}) // true

isFunction(() => {}) // true
isFunction(async () => {}) // true
```
- `isNaN` 是否是NaN
- `isNumber` 是否是数字
- `isInteger` 是否是整数
- `isFloat` 是否是浮点数
- `isSymbol`是否是Symbol
- `isUndefined`  是否是undefined
- `isObject`  是否是Object
- `isNull` 是否是null
- `isPromise` 是否是Promise
- `isRegExp` 是否是正则表达式
- `isDate` 是否是Date
- `isSet` 是否是Set
- `isEmpty`  如果检测值是‘’ 0 undefined null NaN, 返回true
```javascript
isEmpty('', 0, null, undefined, NaN) // true
```

### 类型
**Types**用于校验更复杂的场景，我们提供了一系列的类型，这些类型实际上是一个`function`,返回值是一个`T`对象，在下面的文档中会讲到

#### 基础类型
基础类型只有单一类型，没有子类型。
所有内设的基础类型有：
- `string`

**用途**：用于校验输入的值是否是字符串

**使用方法**：
```javascript
const { string } = require('tegund')

const stringT = string()  // you will got a stringT, which instanceof T
// then validate
stringT.check('a', 'b')
```
如你所料，我们还有下面这一系列基础类型：
- `boolean`  
- `function`   为避免命名冲突， 也可使用 `func`代替
- `syncfunction`  
- `asyncfunction` 
- `nan` 
- `number` 
- `integer` 
- `float` 
- `symbol`
- `undefined`  为避免命名冲突， 也可使用 `undef`代替
- `null` 
- `promise` 
- `regexp` 
- `date` 
- `set`
- `empty`

#### 复合类型
复合类型允许对子元素的类型进行定义，有了复合类型，我们可以对更多复杂场景作校验：
- `array`
``` javascript
// 当不需要校验子元素时，不传值
array()

// 假设需要子元素都是字符串
// 可传入一个string()作为参数
array(string())
// 或者使用别名
array('string')

// 假设子元素的内容可以是字符串或数字， 可传入多个类型
array(string()， number()) // or array('string', 'number')

// 假设需要数组第一项是字符串，第二项是数字, 则传入一个数组
array([string(), number()])

// 或者
array(['string', 'number'])
```
- `object`  
object类型用于定义一个集合

``` javascript
// 当不需要校验传入对象的属性时
object()

// 假设希望该对象具有一个string类型的name属性
object({
  name: string()
})
// 或者使用别名
object({
  name: 'string'
})

// 假设有更为复杂的场景，比如希望有一个属性a，它是一个对象，这个对象包含一个字符串类型的属性b
object({
  a: object({
    b: string()
  })
})
// 这样有点难看，我们还可以省略第二级的object
object({
  a: {
    b: 'string'
  }
})
```

#### 特殊类型

- `at` 
**at**用于创建更为复杂的场景，有时候我们希望可以同时支持多种类型
``` javascript
// 比如希望输入的值可以是字符串或者数字
at(string(), number())
// 使用别名
at('string', 'number')
```

- `notat`
**notat**正好相反，表示都不是
``` javascript
// 比如希望输入的值既不是字符串也不是数字
notat(string(), number())
// 使用别名
notat('string', 'number')
```

- `any`
**any**可以用于匹配任何类型
``` javascript
// 通常用来作站位符号，比如希望对象具有a属性，但是不关心a属性具体是什么值
object({
  a: any()
})
```

- `never`
**never**用于匹配一个不存在的类型
``` javascript
// 通常用来作站位符号，比如不希望对象具有a属性
object({
  a: never()
})
```

### 原型
如上面的文档说的那样，我们使用类型函数调用来获取类型，实际上，上面每一个函数调用后都会获得一个内置的原型对象：

####  `T`

> 在typescript中，一般把T当作泛型，tegund的T没有这层含义，它只是一个很普通的class

构建一个空白的类型对象：
```javascript
const { T } = require('tegund')
const t = new T()

t.check('')  // true
```
##### 实例方法
校验：
- `test(data1, data2...)` 用于校验提供的数据，当校验不通过时返回一个`ValidateError`
- `check(data1, data2...)` 用于校验提供的数据，当校验不通过时返回`false`
- `assert(data1, data2...)`断言，用于校验提供的数据，当校验不通过抛出一个`ValidateError`

下面的方法支持链式调用，即始终返回当前对象T
- `forbid(flag)`该字段是否禁止输入， flag默认`true`, 传入`false`时表示不禁止， 返回当前对象
- `instance(parent)` 是否是parent的实例， 返回当前对象
```javascript
const { T } = require('tegund')
const t = new T()

t.instance(Error)

t.check('')  // false
t.check(new Error()) // true
```

- `or(t)` 或者， 返回当前对象
```javascript
const t = string().or(number())

t.check('')  // true
t.check(1)  // true
t.check(true)  // false
```

- `addValidator(v)` 添加一个自定义校验器， 如果已存在同名校验器则覆盖， 返回当前对象

参数：
```javascript
// v必须是一个对象，且含有validator属性, name 和 message可选
object({
 name: string().optional(),
 message: string().optional(),,
 validator: func()
})
```

例如：
```javascript
const t = new T()

t.addValidator({
  name: 'stringEqualTo1',
  validator: val => val === '1',
  message: 'val expected equal to "1"'
})

t.test('')  // ValidateError val expected equal to "1"
t.check('1')  // true
```

- `removeValidator(vname)` 根据名称移除自定义校验器， 返回当前对象

接上例：
```javascript
t.removeValidator('stringEqualTo1')

t.test('')  // undefined
```

- `optional(falg)` 是否可选填，flag默认`true`
-  `enum(list)` 是否在list范围里面
```javascript
const t = string().enum(['a', 'b'])
t.check('')  // false
t.check('a')  // true
```
- `clone()` 克隆当前对象，返回一个和当前对象一致且不关联的对象T
```javascript
const t = string().min(3)
t.check('')  // false

const t2 = t.clone().min(0)
t.check('')  // true
```

#### `ArrayT` 
**ArrayT**用于创建数组形式的是校验类型，它继承至`T`
```javascript
array() instanceof ArrayT // true
// 用法
const arrayT = new ArrayT(string(), number())
```

#### `ObjectT` 
**ObjectT**用于创建对象形式的是校验类型，它继承至`T`
```javascript
object() instanceof ObjectT // true
// 用法
const objectT = new ObjectT({
  name: string()
})
```
##### 实例方法
- `strict(flag)` 检测对象是否有定义范围外的属性
```javascript
const t = object({ a: string() })
t.check({ a: 'abc', b: 1 }) // true

t.strict()
t.check({ a: 'abc', b: 1 }) // false
```

- `testProvided(data1, data2...)` 只检测对象已提供的属性
```javascript
const t = object({ a: string()，b: number() })
t.test({ a: 'abc' }) // can not pass

t.testProvided({ a: 'abc' }) // pass, will ignore b, because it wasn't provided
```

- `extend(t1, t2...)` 继承其他ObjectT的属性
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
**AtT**用于创建多种可能形式的类型，它继承至`T`
#### `NotAtT` 
**NotAtT**用于创建多种可能形式的类型，它继承至`AtT`
#### `NeverT` 
**NeverT**用于创建多种可能形式的类型，它继承至`T`

### 修饰符
tegund 支持链式调用，即每一个除校验之外的方法，都是默认返回对象本身，这使得tegund非常直观且容易组合。
除了基本的类型校验外，tegund还支持许多内置的修饰符，这些修饰符也会返回当前对象：
#### String
- `min(num, errorMessage)` 最小长度
- `max(num, errorMessage)` 最大长度 
- `length(num, errorMessage)` 长度
- `pattern(p, errorMessage)` 添加正则校验, 是否可以通过正则p的验证
- `contain(str, errorMessage)` 是否含有str片段
 
- `numeric()` 纯数字字符
- `alpha()` 纯字母字符
- `alphaNumeric()` 纯数字加字母字符
- `hex()` 纯十六进制字符
- `base64()` base64字符

#### Number
- `min(num, errorMessage)` 最小值
- `max(num, errorMessage)` 最大值
- `pattern(p, errorMessage)` 添加正则校验
 
- `positive()` 正数
- `negative()` 负数

#### Date
- `min(date, errorMessage)` 最小日期
- `max(date errorMessage)` 最大日期

#### Array
- `min(num, errorMessage)` 最小数组长度
- `max(num, errorMessage)` 最大数组长度 
- `length(num, errorMessage)` 数组长度

### 错误
tegund 内置了一个`ValidateError`,  它继承至`Error`对象
```javascript
const { ValidateError, string } = require('tegund')

string().test(1) instanceof ValidateError // true
```

### 自定义类型
任意的类型在经过额外处理后，都会返回一个类型对象，这个对象本身就是一个新的类型。
不过，你可能想要定义一个全局类型，使得在任意位置都可以直接使用。或者，你想使用对象的别名来代替对象。在这种情况下，我们推荐你自定义类型。

tegund 内置了一个`defineType`方法，允许你自定义或者覆盖已有类型：
```javascript
const { defineType, string } = require('tegund')

// create a string type, which length must gte than 10, and named 'longText'
const longText = defineType('longText', () => string().min(10))

// you can use it right now
longText.test('')  // false

// or use it's alias
const t = object({
  content: 'longText'
})
t.test({})
```
>你必须在类型使用前定义它，即必须放在程序入口处，否则tegund无法找到该对象

使用`defineType`还可以覆盖内置的类型，但是不推荐这么做


## License

[MIT](https://github.com/aim-leo/tegund/blob/master/LICENSE)

Copyright (c) 2021-present aim-leo