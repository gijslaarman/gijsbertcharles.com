const nunjuckStatic = require('./src/modules/nunjuckStatic.js')
const get = require('./src/modules/api')
const nunjucks = require('nunjucks')

nunjucks.configure('src/views', {
    autoescape: true
})

nunjuckStatic.config({
    staticDirectory: __dirname + '/public'
})

nunjuckStatic.generateIndex('index.html')
nunjuckStatic.generateIndex('404.html')

get.portfolioItems().then(items => {
    items.forEach(portfolioItem => {
        nunjuckStatic.generateSubpage('/' + portfolioItem.slug, 'portfolio-item.html', {title: portfolioItem.title.rendered})
    })
})