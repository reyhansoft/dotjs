const express = require('express')
const config = require('./config')
const path = require('path')
const router = require('./services/router')({
  pagesPath: path.resolve(config.paths.output)
})
const currentTheme = 'default'
const pagePlugin = require('./plugins/page')
const prismJsPlugin = require('./plugins/prismjs')
const breadcrumbPlugin = require('./plugins/breadcrumb')
const topmenuPlugin = require('./plugins/topMenu')

const hbsTemplateEngine = require('./services/hbsTemplateEngine')()
const templateEngine = require('./services/templateEngine')({
  defaultTheme: currentTheme,
  engines: [
    hbsTemplateEngine
  ],
  themesPath: 'themes',
  plugins: {
    page: pagePlugin(),
    prismjs: prismJsPlugin(),
    breadcrumb: breadcrumbPlugin(),
    topmenu: topmenuPlugin()
  },
  defaultPlugins: ['topmenu', 'breadcrumb', 'page']
})

const contextBuilder = require('./services/context')

const app = express()

app.use(`/themes/${currentTheme}`, express.static(path.resolve(`./themes/${currentTheme}/assets`)))
app.use('/assets', express.static(path.resolve('./assets')))

app.use('/*', (req, res, next) => {
 
  const context = contextBuilder({ router }, req)

  if (!context.route) {
    res.sendStatus(404)
    return
  }
    
  if (context.route.type == 'rdr') {
    res.redirect(context.route.path)
    return
  }
  if (context.route.template) {
    res.send(templateEngine.render(currentTheme, context))
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
