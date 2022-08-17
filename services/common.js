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

module.exports = {
  listDirectoriesRecursively,
  isProd
}