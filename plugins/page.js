module.exports = function () {
  return {
    name: 'page',
    placeholder: 'page',
    run: function ({ route, model, template }) {
      return {
        model: {
          page: {
            title: route.handler.meta.title
          },
          model
        },
        template
      }
    }
  }
}