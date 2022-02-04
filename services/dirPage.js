module.exports = function ({ meta }, depth = 1) {
  return {
    meta,
    get ({ route, router }) {
      const contents = router.getSubRoutes(route.realPath, depth)
      return {
        contents: contents.sort((a, b) => a.isDir - b.isDir)
      }
    }
  }
}
