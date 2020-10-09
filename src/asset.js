const typeLib = require('./type')

const { whatType, isFunction, isArray, types } = typeLib

function accept(obj, typedFunction, message) {
  if (!isFunction(typedFunction)) {
    throw new Error('typedFunction expected a function')
  }
  const flag = typedFunction(obj)

  if (!flag) {
    throw new Error(
      message ||
        `obj expected a ${typedFunction.name.replace(
          'is',
          ''
        )} type, but got a ${whatType(obj)}`
    )
  }
}

function acceptArray(objs, typedFunction, message) {
  accept(
    objs,
    isArray,
    `acceptArray objs expected a array, but got a ${whatType(objs)}`
  )

  for (const index in objs) {
    accept(
      objs[index],
      typedFunction,
      `acceptArray[${index}] fault, message: ${message}`
    )
  }
}

function refuse(obj, typedFunction, message) {
  if (!isFunction(typedFunction)) {
    throw new Error('typedFunction expected a function')
  }
  const flag = typedFunction(obj)

  if (flag) {
    throw new Error(
      message ||
        `obj can not be a ${typedFunction.name.replace('is', '')} type!`
    )
  }
}

function refuseArray(objs, typedFunction, message) {
  accept(
    objs,
    isArray,
    `refuseArray objs expected a array, but got a ${whatType(objs)}`
  )

  for (const index in objs) {
    refuse(
      objs[index],
      typedFunction,
      `refuses[${index}] fault, message: ${message}`
    )
  }
}

const assets = {}

for (const type of types) {
  const typedFunction = typeLib['is' + type]

  assets[`accept${type}`] = (obj, message) =>
    accept(obj, typedFunction, message)

  assets[`accept${type}Array`] = (objs, message) =>
    acceptArray(objs, typedFunction, message)

  assets[`refuse${type}`] = (objs, message) =>
    refuse(objs, typedFunction, message)

  assets[`refuse${type}Array`] = (objs, message) =>
    refuseArray(objs, typedFunction, message)
}

module.exports = {
  accept,
  acceptArray,

  refuse,
  refuseArray,

  ...assets,
}
