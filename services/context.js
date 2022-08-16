module.exports = function ({
    router
}, req) {
  const path = req.originalUrl.replace(/\?.*$/, '')
  const route = router.getRoute(path)
  
  const context = {
    router,
    route
  }
  context.model = typeof route?.handler?.get === 'function'
    ? route.handler.get(context)
    : {}

  return context
}