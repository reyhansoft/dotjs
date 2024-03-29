module.exports = function () {
  return {
    name: 'breadcrumb',
    placeholder: 'breadcrumb',
    run: function ({ route, router }) {
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
}