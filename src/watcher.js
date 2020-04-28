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

// caching
let cachePages = []

// Middleware
app.use(express.static('public'))
app.disable('x-powered-by')

function cache() {
    get.pages().then(pages => {
        cachePages = pages

        console.log(cachePages)
    })
}

console.log('yo', process.env.ENVIRONMENT)

cache()

app.get('/', async (req, res) => {
    const posts = await get.posts()
    const homepage = await get.homepage()

    Promise.all([posts, homepage]).then(() => {
        res.render('index.html', {
            articles: posts
        })
    })
})


app.get('/posts/:post', (req, res) => {
    get.post(req.params.post).then(post => {
        return res.render('post.html', post)
    })
})

app.get('/projects/:portfolioitem', (req,res) => {
    console.log(req.params)
    res.render('portfolio-item.html', {title: 'henkie'})
})

app.get('/:page', (req, res) => {
    console.log(cachePages)
    const existingPage = cachePages.find(page => page.slug === req.params.page)

    if (existingPage) {
        res.render('page.html', { page: existingPage })
    } else {
        res.status(404).render('404.html')
    }
})

// handle 404 pages.
app.get('*', (req, res) => {
    res.status(404).render('404.html')
})

app.listen(port, () => {
    console.log(`Running, listening on: localhost:${port}`)
})