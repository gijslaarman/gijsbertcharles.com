// Import / requires
const express = require('express')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')
const nunjuckStatic = require('./src/modules/nunjuckStatic.js')
const get = require('./src/modules/api.js')
// dotenv config
dotenv.config()

// Express config
const app = express()
const port = process.env.PORT || 3000

// Nunjucks config
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

nunjucks.configure('src/views', {
    express: app,
    autoescape: true
})

nunjuckStatic.config({
    staticDirectory: __dirname + '/public'
})

// Middleware
app.use(express.static('public'))
app.use(express.static('pages'))
app.disable('x-powered-by')

app.post('/update-website', (req, res) => {
    console.log(req.body)
    nunjuckStatic.generateIndex('index.html')
    nunjuckStatic.generateIndex('404.html')

    get.portfolioItems().then(items => {
        items.forEach(portfolioItem => {
            nunjuckStatic.generateSubpage('/' + portfolioItem.slug, 'portfolio-item.html', {title: portfolioItem.title.rendered})
        })
    })

    res.send('Updated website!')
})

app.get('*', (req, res) => {
    // Public handles all existing pages, but doesn't handle not found pages. So if the page cannot be found in public send a 404 page.
    res.status(404).sendFile(__dirname + '/public/404.html')
})

app.listen(port, () => {
    console.log(`Running, listening on: localhost:${port}`)
})