const path = require('path')
const fs = require('fs')

module.exports = function ({
  engines,
  themesPath,
  defaultTheme
}) {
  
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
    render (theme, templatePath, model, context) {
      const filename = path.basename(templatePath)
      const engine = engines.find(t => t.canHandle(filename))
      if (engine === undefined) {
        // error
        return null
      } else {
        const contents = engine.render(templatePath, model)
        result = renderLayout(theme, { body: contents, ...context })
        return result
      }
    }
  }
}
