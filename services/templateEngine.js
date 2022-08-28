const path = require('path')
const fs = require('fs')
const _ = require('lodash')

module.exports = function ({
  engines,
  themesPath,
  defaultTheme,
  plugins,
  defaultPlugins
}) {
  
  const pluginsPath = path.resolve(themesPath, defaultTheme, 'plugins')

  function getLayoutFile(theme) {
    const files = fs.readdirSync(path.join(themesPath, theme))
    layoutFile = files.find(t => t.startsWith('layout.'))
    if (!layoutFile && theme != defaultTheme) {
      return getLayoutFile(defaultTheme)
    }
    return path.join(themesPath, theme, layoutFile)
  }

  function renderLayout(theme, model) {
    let layoutPath = getLayoutFile(theme)
    const filename = path.basename(layoutPath)
    const engine = engines.find(t => t.canHandle(filename))
    return engine.render(layoutPath, model)
  }

  return {
    render (theme, context) {
      const filename = path.basename(context.route.template)
      const engine = engines.find(t => t.canHandle(filename))
      if (engine === undefined) {
        // error
        return null
      }

      const pagePlugins = [...defaultPlugins, ...(context.route.handler.plugins || [])]
      context.template = fs.readFileSync(context.route.template, 'utf8')

      let model = {
        layout: {
          body: [],
          head: []
        }
      }

      if (Array.isArray(pagePlugins)) {
        pagePlugins.forEach(plugin => {
          var requestedPlugin = plugins.find(t => t.name === plugin)
          if (requestedPlugin) {
            const result = requestedPlugin.run(context)

            if (result.model) {
              model = _.merge(result.model, model)
            }
            if (requestedPlugin.placeholder) {
              if (result.template) {
                engine.addPluginTemplate(requestedPlugin, result.template)
              } else {
                engine.TryAddAddPlugin(requestedPlugin, pluginsPath)
              }
            }
            if (Array.isArray(result.head)) {
              model.layout.head = [...model.layout.head, ...result.head]
            }
            if (Array.isArray(result.body)) {
              model.layout.body = [...model.layout.body, ...result.body]
            }
          }
        })
      }

      result = renderLayout(theme, model)
      return result
    }
  }
}
