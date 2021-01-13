# tegund 2.0 api

## types:
-string
-number
 -float
 -int
-boolean

-object
-array
-date
-partten
-function
 -pureFunction
 -asyncFunction
-promise
-symbol
-set

-nan
-undefined
-null

## sugar
empty // '' null undefined false NaN 0
any
never


## conditions
at
notat
instance


## struct
object({
  a: string(),
  b: number(),
  c: object({
    d: string()
  }),
  d: array(),
  e: array(string()),
  f: at(string(), number()),
  g: 'abc',  // must equal
  h: notat(string(), number())
})

array(string())
array(at(string(), number()))

### struct can be extend


## params
length
min
max
optional
empty

validate
partten
instance
enum

emptyable
nullable

or  // string().or(number()).or(boolean())

## express
{
  a: 'string?',
  b: 'boolean',
  c: 'string|number',
  d: 'string(3,10)',
  e: 'number(1,200)'
  f: 'array<string>(0, 1)',
  g: 'array(0, 10)',
  h: 'object{a:string,b:number}',
  i: 'promise',
  j: '!parrten!empty'
}

## validate
is
isnot

is(string(), a)

const struct = object({
  a: string()
})

is(struct, a)

// if input a function, means validate function
is(n => n > 10, a)

// if input a pure data, like string, number, float, means equal
is(false, a)

## asset
asset(string(), a, 'a is expected a string')

## typedAsset
## assetI18n

