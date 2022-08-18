module.exports = function () {
  return {
    name: 'listdirpage',
    placeholder: 'page',
    run: function ({ router, route, model, template }) {
      return {
        model: {
          page: {
            title: route.handler.meta.title,
            contents: router.getSubRoutes(route.realPath, 1)
          },
          model
        }
      }
    }
  }
}