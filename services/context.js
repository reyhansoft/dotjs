module.exports = function ({
    router,
    route
}) {
  return {
    menu: router.getPagesStructure(),
    router,
    route
  }
}