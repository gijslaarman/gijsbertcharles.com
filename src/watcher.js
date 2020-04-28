/*
---
Watcher file for development purposes, does not build static sites but renders them serverside.
---
*/

// Import / requires
const express = require('express')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')
const get = require('./server_modules/api.js')
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

// Middleware
app.use(express.static('public'))
app.disable('x-powered-by')

app.get('/', async (req, res) => {
    const posts = await get.posts()
    const homepage = await get.homepage()

    Promise.all([posts, homepage]).then(() => {
        console.log(posts)

        res.render('index.html', {
            articles: posts
        })
    })
})

app.get('/:post', (req, res) => {
    get.post(req.params.post).then(post => {
        return res.render('post.html', {
            title: post.title.rendered,
            postContent: post.content.rendered
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