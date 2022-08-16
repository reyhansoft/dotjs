module.exports = function () {
  return function ({ route, router }) {
    return {
      model: {
        breadcrumb: {
          currentPageTitle: route.handler.meta.title,
          items: router.getPathFromRoot(route.realPath)
        }
      }
    }
  }
}