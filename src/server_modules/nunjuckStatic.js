const nunjucks = require('nunjucks')
const fs = require('fs')
const minify = require('html-minifier').minify
const path = require('path')

nunjuckStaticGenerator = {
    config(obj) {
        this.staticDirectory = obj.staticDirectory || this.staticDirectory || undefined
    },

    emptyDirectory() {
        if (fs.existsSync(this.staticDirectory)) {
            fs.rmdirSync(this.staticDirectory, { recursive: true })
        }
    },

    generateIndex(template, details) {
        return this.generate(template, details, `${this.staticDirectory}`)
    },

    generateSubpage(folder, template, details) {
        if (!folder) throw new Error('Define a folder in where to generate the subpage. > "/path/to/folder"')

        return this.generate(template, details, `${this.staticDirectory}${folder}`)
    },

    generate(template, details, dirPath) {
        /* Prevent errors from happening. */
        if (!this.staticDirectory) throw new Error('No static directory configured. Configure one with "nunjuckStatic.config({ staticDirectory: __dirname + "/public"}) e.g." function.')

        if (!fs.existsSync(dirPath)) { 
            console.log('\x1b[33mCreating new folder: ' + dirPath + '\x1b[0m')
            fs.mkdirSync(dirPath, { recursive: true }) 
        }

        // Make up the html.
        const html = nunjucks.render(template, details)

        let htmlName = template === '404.html' ? '404.html' : 'index.html' // Hacky way to say if you have a 404 page template render it as 404.html not index.html

        const dir = `${dirPath}/${htmlName}` // join paths.
        const minified = minify(html, { collapseWhitespace: true }) // Nunjucks makes quite ugly html with a lot of whitespace, so not performant. So let's minify the HTML before writing it. 

        fs.writeFileSync(dir, minified, (err) => {
            if (err) throw new Error(err)
            console.log('Created: ' + dir)
            return true
        })
    }
}

module.exports = nunjuckStaticGenerator