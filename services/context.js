module.exports = function ({
    router,
    route
}) {
  return {
    menu: router.getPagesStructure(),
    route
  }
}