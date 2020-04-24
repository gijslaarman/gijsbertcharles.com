/*
---
Watcher file for development purposes, does not build static sites but renders them serverside.
---
*/

// Import / requires
const express = require('express')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')
const get = require('./modules/api.js')
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

// Middleware
app.use(express.static('public'))
app.disable('x-powered-by')

app.get('/', (req, res) => {
    get.homepage().then(homepage => {
        res.render('index.html', {
            title: homepage.title.rendered,
            content: homepage.content.rendered
        })
    })
})

app.get('/projects/:portfolioitem', (req,res) => {
    console.log(req.params)
    res.render('portfolio-item.html', {title: 'henkie'})
})

// handle 404 pages.
app.get('*', (req, res) => {
    res.status(404).render('404.html')
})

app.listen(port, () => {
    console.log(`Running, listening on: localhost:${port}`)
})