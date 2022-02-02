const express = require('express')
const path = require('path')
const router = require('./services/router')({
  pagesPath: path.resolve('./pages')
})
const currentTheme = 'default'

const hbsTemplateEngine = require('./services/hbsTemplateEngine')()
const templateEngine = require('./services/templateEngine')({
  defaultTheme: currentTheme,
  engines: [
    hbsTemplateEngine
  ],
  themesPath: 'themes'
})

const contextBuilder = require('./services/context')

const app = express()

app.use(`/themes/${currentTheme}`, express.static(path.resolve(`./themes/${currentTheme}/assets`)))
app.use('/assets', express.static(path.resolve('./assets')))

app.use('/*', (req, res, next) => {
  const path = req.originalUrl.replace(/\?.*$/, '')
  
  const route = router.getRoute(path)
 
  if (!route) {
    res.send('NOT FOUND')
    return
  }
    const context = contextBuilder({ router, route })
    if (route.type == 'rdr') {
      res.redirect(route.path)
      return
    }
    let model = {}
    if (typeof route.handler?.get === 'function') {
      model = route.handler.get()
    }
    if (route.template) {
      res.send(templateEngine.render(currentTheme, route.template, model, context))
    } else {
      res.send(model)
    }

})

app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.send('error')
});

module.exports = app
