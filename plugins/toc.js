module.exports = function () {
  return {
    name: 'toc',
    placeholder: 'toc',
    run: function ({ route, model, template }) {
      return {
        model: {
          page: {
            toc: route.handler.toc
          }
        }
      }
    }
  }
}
