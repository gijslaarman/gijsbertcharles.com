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
    // get.portfolioItems().then(json => res.send(json))
})

app.get('/:404', (req, res) => {
    res.sendFile(__dirname + '/404.html')
})

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

// // 404 if above routes and static folders have nothing.
// app.get('/:anything', (req, res) => {
//     res.sendFile(__dirname + '/pages/404.html')
// })

app.listen(port, () => {
    console.log(`Running, listening on: localhost:${port}`)
})