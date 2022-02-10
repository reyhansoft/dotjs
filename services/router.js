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
        realPath: urlPath,
        isDir: false
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

  // handling /index pages
  for (let routePath in routes) {
    if (routePath.endsWith('/index')) {
      const newPath = routePath.substring(0, routePath.length - 5)
      routes[newPath] = routes[routePath]
      routes[newPath].path = newPath
      routes[newPath].isDir = true
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
          if (route.type == 'main' && route.handler?.meta?.title) {
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
      },
      getSubRoutes (route, depth = 1) {
        
        if (!route.endsWith('/index') || depth < 1) {
          return []
        }

        const routePath = route.substring(0, route.length - 5)
        const countOfSlashes = countCharInString(routePath, '/')

        const subRoutes = Object.values(routes)
          .filter(t => {
            if (t.type !== 'main') return false
            const countOfSlashesInSubRoute = countCharInString(t.realPath, '/')
            return t.realPath !== route &&
              t.realPath.startsWith(routePath) &&
              (
                countOfSlashesInSubRoute - countOfSlashes < 1 ||
                (countOfSlashesInSubRoute - countOfSlashes === 1 && t.realPath.endsWith('/index'))
              )
          })
          .map(t => {
              t['childs'] = t.isDir
                ? this.getSubRoutes(t.realPath, depth - 1)
                : []
            return t
          })
        return subRoutes
      },
      getPathFromRoot (routeRealPath) {
        const pathParts = routeRealPath.split('/')
        let path = '/'
        let result = []
        const routesArray = Object.values(routes)
        const endIndex = pathParts[pathParts.length - 1] === 'index'
          ? pathParts.length - 1
          : pathParts.length
        for (let i  = 1; i < endIndex; i++) {
          const route = routesArray.find(t => t.realPath === `${path}index`)
          result.push(route)
          path += pathParts[i] + '/'
        }
        return result
      }
    }
}