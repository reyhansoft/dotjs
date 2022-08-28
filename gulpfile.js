const path = require('path')
const fs = require('fs')
const { listDirectoriesRecursively, assignObjectProperty } = require('./services/common')
const cheerio = require('cheerio')
const { paths } = require('./config')
const { marked } = require('marked')

const pageMeta = {
  'meta.title': 'string',
  'meta.description': 'string',
  'plugins': 'array'
}

function getPageMetaPropValue(name, value) {
  if (!pageMeta[name] || pageMeta[name] === 'string') {
    return value
  }
  if (pageMeta[name] === 'array') {
    return value.split(',').map(t => t.trim())
  }
}

function buildDjs() {
  const pages = listDirectoriesRecursively(path.resolve(paths.pages))
    .filter(t => t.endsWith('.djs'))

  pages.forEach((page) => {
    const content = fs.readFileSync(page, 'utf8')
    const pageName = path.basename(page).replace('.djs', '')
    const pageDirPath = path.join(path.resolve(paths.output), path.relative(paths.pages, path.dirname(page)))

    if (!fs.existsSync(pageDirPath)) {
      fs.mkdirSync(pageDirPath, { recursive: true })
    }

    const dom = cheerio.load(content, { useHtmlParser2: true })

    const template = dom('head > template')
    if (template) {
      const engine = template.attr('engine')
      let src = template.attr('src')
      if (src) {
        if (src.startsWith('~/')) {
          src = path.join(path.resolve('.'), src.substring(2))
        } else {
          src = path.join(pageDirPath, src)
        }
      }
      const content = src
        ? fs.readFileSync(src, 'utf8')
        : template.html().trim()
      fs.writeFileSync(path.join(pageDirPath, pageName + '.' + engine), content)
    }
    const script = dom('head > script')
    let scriptContent = script
      ? script.html().trim()
      : 'module.exports = ' + JSON.stringify({ meta: { title: pageName } })

    fs.writeFileSync(path.join(pageDirPath, pageName + '.js'), scriptContent)

  })
}

function generatePageTableOfContents() {

}

function buildMd() {
  const engine = 'hbs'
  const pages = listDirectoriesRecursively(path.resolve(paths.pages))
    .filter(t => t.endsWith('.md'))
    pages.forEach((page) => {
      const content = fs.readFileSync(page, 'utf8').trim()
      const pageName = path.basename(page).replace('.md', '')
      const pageDirPath = path.join(path.resolve(paths.output), path.relative(paths.pages, path.dirname(page)))
  
      if (!fs.existsSync(pageDirPath)) {
        fs.mkdirSync(pageDirPath, { recursive: true })
      }

      if (!content.startsWith('---')) {
        throw new Error(`markdown files should start with page meta data: ${page}
sample: 
---
meta.title: Welcome
meta.description: Welcome to the page
plugins: plugin1, plugin2
---`)
      }

      const pageData = {}
      content.substring(3, content.indexOf('---', 3)).split('\n').forEach(line => {
        if (line.trim() === '') {
          return
        }
        [propName, propValue] = line.trim().split(':')
        assignObjectProperty(pageData, propName.trim(), getPageMetaPropValue(propName.trim(), propValue.trim()))
      })

      const renderer = new marked.Renderer();
      const linkRenderer = renderer.link;
      const headingRenderer = renderer.heading
      const base_url = 'https://www.dotjs.ir/'
      
      let lastLevel = 2
      const toc = []
      renderer.heading = (text, level, raw, slugger) => {

        const html = headingRenderer.call(renderer, text, level, raw, slugger)
        if (level === 1) {
          lastLevel = level
          return html
        }
        // normalize level
        lastLevel = level > lastLevel && level - lastLevel > 1
          ? lastLevel + 1
          : level
        toc.push({
          level: lastLevel - 1,
          title: text, 
          id: html.split('id="')[1].split('">')[0]
        })
        return html
      }

     

      renderer.link = (href, title, text) => {
        const isAbsolute = /^\w+:\/\/.+$/.test(href)
        const localLink = !isAbsolute || href.startsWith(base_url)
        const html = linkRenderer.call(renderer, href, title, text)
        return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `)
      }
      marked.setOptions({
        renderer: renderer,
        gfm: true,
        highlight: function (code, lang, callback) {
          return "\n" + code
        }
      })

      const template = marked.parse(content.substring(content.indexOf('---', 3) + 3))
      fs.writeFileSync(path.join(pageDirPath, pageName + '.' + engine), template)

      pageData.toc = toc

      const scriptContent = 'module.exports = ' + JSON.stringify(pageData)
      fs.writeFileSync(path.join(pageDirPath, pageName + '.js'), scriptContent)
    })
}

function build(cb) {
  // place code for your default task here
  cb()

  buildMd()
}

exports.default = build
