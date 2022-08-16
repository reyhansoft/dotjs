module.exports = function () {
  return function ({ router, route }) {
    return {
      model: {
        topmenu: {
          items: router.getPagesStructure().map(({ path, title }) => ({
            active: route.path === path,
            path,
            title
          }))
        }
      }
    }
  }
}