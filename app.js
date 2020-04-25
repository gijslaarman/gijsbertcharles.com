// Import / requires
const express = require('express')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')
const nunjuckStatic = require('./src/modules/nunjuckStatic.js')
const build = require('./src/modules/build.js')
// dotenv config
dotenv.config()

// Express config
const app = express()
const port = process.env.PORT || 3000

// Nunjucks config
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

nunjucks.configure(['src/views', 'src/components'], {
    express: app,
    autoescape: true
})

nunjuckStatic.config({
    staticDirectory: __dirname + '/pages'
})

// Middleware
app.use(express.static('public'))
app.use(express.static('pages'))
app.disable('x-powered-by')

app.post('/update-website', (req, res) => {
    build(function() {
        res.send('Updated website!')
    })
})

app.get('*', (req, res) => {
    // Public handles all existing pages, but doesn't handle not found pages. So if the page cannot be found in public send a 404 page.
    res.status(404).sendFile(__dirname + '/pages/404.html')
})

app.listen(port, () => {
    console.log(`Running, listening on: localhost:${port}`)
})

// used for NPM run script: npm run build
module.exports.staticBuild = function() {
    build(() => {
        console.log('Build pages')
        return process.exit(0) // Don't start the server.
    })
}