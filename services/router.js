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

function createRoutes (files, pagesPath) {
  let routes = {}

  files.forEach(file => {
    const fileFullPath = path.join(pagesPath, file)
    const urlPath = '/' + file
      .substring(0, file.lastIndexOf('.'))
      .toLowerCase()
      .replaceAll(path.sep, '/')
    const type = file.substring(file.lastIndexOf('.'))
    if (!(urlPath in routes)) {
      routes[urlPath] = {
        type: 'main',
        path: urlPath,
        realPath: urlPath
      }
    }
    if (type === '.js') {
      const filePath =  file.replaceAll(path.sep, '/')
      routes[urlPath]['page'] = filePath.substring(0, filePath.length - 3) + '.djs'
      routes[urlPath]['handler'] = require(fileFullPath)
    } else if (!routes[urlPath]['template']) {
      routes[urlPath]['template'] = fileFullPath
    }
  });

  console.log(routes)

  // handling /index pages
  for (let routePath in routes) {
    if (routePath.endsWith('/index')) {
      const newPath = routePath.substring(0, routePath.length - 5)
      routes[newPath] = routes[routePath]
      routes[newPath].path = newPath
      routes[routePath] = { type: 'alt', path: newPath }
    }
  }
  
  return routes
}

function countCharInString(str, char) {
  let count = 0
  for (let index = 0; index < str.length; index++) {
    if (str[index] === char) count++
  }
  return count
}

module.exports = function ({
    pagesPath
}) {

    const files = listDirectoriesRecursively(pagesPath)
      .map(t => path.relative(pagesPath, t))

    let routes = createRoutes(files, pagesPath)

    return {
      getRoute (urlPath) {
        let route = routes[urlPath.toLowerCase()]
        if (route === undefined) {
          route = routes[urlPath.toLowerCase() + '/']
          if (route) {
            // TODO: handle alt rdr, ...
            if (route.type === 'alt') {
              route = routes[route.path]
            }
            return {
              type: 'rdr',
              path: route.path
            }
          }
        }
        if (route?.type === 'alt') {
          route = routes[route.path]
        }
        return route
      },
      getPagesStructure () {
        let result = []
        const routePaths = Object.keys(routes)
        routePaths.sort((a, b) => {
          const countA = countCharInString(a, '/')
          const countB =  countCharInString(b, '/')
          return countA === countB
            ? a.length - b.length
            : countA - countB
        })
        routePaths.forEach((path) => {
          const route = routes[path]
          console.debug('adding path > ' + path)
          if (route.type == 'main' && route.handler?.meta?.title) {
            console.debug('path is main and has a title')
            const pathParts = path.split('/')
            if (pathParts[pathParts.length - 1] === '') {
              pathParts.pop()
            }
            let parentPath = '/'
            let metnuItems = result
            for(let index = 1; index < pathParts.length - 1; index++) {
              parentPath += pathParts[index] + '/'
              metnuItems = metnuItems.find(t => t.path === parentPath)?.items
              if (!metnuItems) {
                break
              }
            }
            if (metnuItems) {
              metnuItems.push({
                path,
                title: route.handler?.meta?.title,
                items: []
              })
            }
          }
        })
        return result
      }
    }
}