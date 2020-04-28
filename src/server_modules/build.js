const nunjuckStatic = require('./nunjuckStatic.js')
const get = require('./api')

const createPortfolioItems = new Promise(function (resolve, reject) {
    get.portfolioItems()
        .then(items => {
            items.forEach(portfolioItem => {
                return nunjuckStatic.generateSubpage('/' + portfolioItem.slug, 'portfolio-item.html', { title: portfolioItem.title.rendered })
            })
            resolve(true)
        })
})

function homepage() {
    return new Promise((resolve, reject) => {
        get.homepage()
            .then(homepage => {
                nunjuckStatic.generateIndex('index.html',
                    {
                        title: homepage.title.rendered,
                        content: homepage.content.rendered
                    })
                resolve(true)
            }).catch(err => reject(err))
    })
}

function build(callback) {
    nunjuckStatic.generateIndex('404.html')

    const promises = [createPortfolioItems, homepage()]
    Promise.all(promises).then(() => { // Wait for everything to be done before continueing.
        if (callback && typeof callback === 'function') {
            return callback()
        } else {
            return
        }
    })
}

module.exports = build