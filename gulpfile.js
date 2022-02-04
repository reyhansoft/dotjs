const path = require('path')
const fs = require('fs')
const { listDirectoriesRecursively } = require('./services/common')
const cheerio = require('cheerio')
const { paths } = require('./config')


function build(cb) {
  // place code for your default task here
  cb();

  const pages = listDirectoriesRecursively(path.resolve(paths.pages))
    .filter(t => t.endsWith('.djs'))

  pages.forEach((page) => {
    const content = fs.readFileSync(page, 'utf8')
    const pageName = path.basename(page).replace('.djs', '')
    const pageDirPath = path.join(path.resolve(paths.output), path.relative(paths.pages, path.dirname(page)))

    if (!fs.existsSync(pageDirPath)) {
      fs.mkdirSync(pageDirPath, { recursive: true })
    }

    const dom = cheerio.load(content, { useHtmlParser2:true })

    const template = dom('head > template')
    if (template) {
      const engine = template.attr('engine')
      const content = template.html().trim()
      fs.writeFileSync(path.join(pageDirPath, pageName + '.' + engine), content)
    }
    const script = dom('head > script')
    let scriptContent = script
      ? script.html().trim()
      : 'module.exports = ' + JSON.stringify({ meta: { title: pageName }})
 
    fs.writeFileSync(path.join(pageDirPath, pageName + '.js'), scriptContent)

  })

}
  
exports.default = build
