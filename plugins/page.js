module.exports = function () {
  return function ({ route, model, template }) {
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