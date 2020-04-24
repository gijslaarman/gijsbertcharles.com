const nunjucks = require('nunjucks')
const fs = require('fs')

nunjuckStaticGenerator = {
    config(obj) {
        this.staticDirectory = obj.staticDirectory || this.staticDirectory || undefined
    },
    generateIndex(template, details) {
        this.generate(template, details, `${this.staticDirectory}`)
    },
    generateSubpage(folder, template, details) {
        if (!folder) throw new Error('Define a folder in where to generate the subpage. > "/path/to/folder"')
        const dirPath = `${this.staticDirectory}${folder}`
        if (!fs.existsSync(dirPath)) { fs.mkdirSync(dirPath) }
        this.generate(template, details, dirPath)
    },
    generate(template, details, dirPath) {
        if (!this.staticDirectory) throw new Error('No static directory configured. Configure one with "nunjuckStatic.config({ staticDirectory: __dirname + "/public"}) e.g." function.')

        const html = nunjucks.render(template, details)
        let htmlName = 'index'
        if (template === '404.html') {
            htmlName = '404'
        }
        const dir = `${dirPath}/${htmlName}.html`

        fs.writeFileSync(dir, html, (err) => {
            if (err) throw new Error(err)
        })
    }
}

module.exports = nunjuckStaticGenerator