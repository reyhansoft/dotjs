module.exports = function ({
    router,
    route
}) {
  return {
    menu: router.getPagesStructure(),
    breadcrumb: router.getPathFromRoot(route.realPath),
    router,
    route
  }
}