const hbs = require('handlebars')
const fs = require('fs')

module.exports = function () {

    hbs.registerHelper('equals', function(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
    })

    hbs.registerHelper('any', function (arg1, options) {
        return Array.isArray(arg1) && arg1.length !== 0 ? options.fn(this) : options.inverse(this)
    })

    return {
        canHandle (filename) {
            return filename.endsWith('.hbs')
        },
        render (templatePath, model) {
            const content = fs.readFileSync(templatePath, 'utf8')
            const template = hbs.compile(content)
            return template(model)
        }
    }
}