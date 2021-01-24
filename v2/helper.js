function objectOverflow(target, source) {
  for (const key in target) {
    if (!(key in source)) {
      return key
    }
  }
}

module.exports = {
  objectOverflow
}