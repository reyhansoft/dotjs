const fs = require('fs')
const path = require('path')

function listDirectoriesRecursively (dir) {
  let result = []
  const files = fs.readdirSync(dir) // here
    .map(f => path.join(dir, f))
  result = files
    .filter(f => fs.statSync(f).isFile())
    .concat(
    files
      .filter(f => fs.statSync(f).isDirectory())
      .flatMap(d => listDirectoriesRecursively(d))
    )
  return result
}

function isProd() {
  return (process.env.NODE_ENV || 'dev') === 'prod'
}

function assignObjectProperty(obj, prop, value) {
  if (typeof prop === "string") {
    prop = prop.split(".")
  }

  if (prop.length > 1) {
    var e = prop.shift();
    assignObjectProperty(obj[e] =
      Object.prototype.toString.call(obj[e]) === "[object Object]"
        ? obj[e]
        : {},
      prop,
      value)
  } else {
      obj[prop[0]] = value
  }
}


module.exports = {
  listDirectoriesRecursively,
  isProd,
  assignObjectProperty
}