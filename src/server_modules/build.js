const nunjuckStatic = require('./nunjuckStatic.js')
const get = require('./api')

let posts = []
let pages = []
let notFound = {}
let portfolioItems = []
let homepage = {}

async function getAllPages() {
    posts = await get.posts()
    pages = await get.pages()
    portfolioItems = await get.portfolioItems()
    homepage = await get.homepage()
    notFound = await get.notFound()
    return
}

// async function createPortfolioItems() {
//     const portfolioItems = await get.portfolioItems()

//     portfolioItems.forEach(portfolioItem => {
//         return nunjuckStatic.generateSubpage('/' + portfolioItem.slug, 'portfolio-item.html', portfolioItem)
//     })

//     return 'done'
// }
function displayConsole(color, msg) {
    switch(color) {
        case 'green':
            return console.log(`\x1b[32m${msg}\x1b[0m`)
        case 'red':
            return console.log(`\x1b[31m${msg}\x1b[0m`)
    }
}

function createPosts() {
    posts.forEach(post => {
        const folder = '/posts/' + post.slug
        nunjuckStatic.generateSubpage(folder, 'post.html', post)
        return displayConsole('green', 'Created post: ' + folder)
    })

}

function createPages() {
    pages.forEach(page => {
        if (page.acf.errorpage) {
            return
        }

        if (page.acf.template === 'posts.html') {
            nunjuckStatic.generateSubpage('/' + page.slug, page.acf.template, { posts, page })
        } else if (page.acf.template === 'portfolio.html') {
            nunjuckStatic.generateSubpage('/' + page.slug, page.acf.template, { portfolioItems, page })
        } else {
            nunjuckStatic.generateSubpage('/' + page.slug, page.acf.template, { page })
        }

        return displayConsole('green', 'Created Page: /' + page.slug + ' | template: ' + page.acf.template)
    })

}

function create404() {
    nunjuckStatic.generateIndex('404.html', notFound)
    return displayConsole('green', 'Created 404-page.')
}

function createHomepage() {
    nunjuckStatic.generateIndex('index.html', {
        articles: posts,
        homepage
    })

    return displayConsole('green', 'Created Homepage.')
}

async function build(callback) {
    getAllPages().then(() => {
        // DELETE EVERY PAGE!!
        nunjuckStatic.emptyDirectory()

        // Create 404 page
        create404()

        // Create homepage.
        createHomepage()

        // Create all pages from wordpress > pages.
        createPages()

        // Create all posts
        createPosts()

        return callback()
    })
}

module.exports = build