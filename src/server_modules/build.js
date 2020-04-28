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

function createPosts() {
    posts.forEach(post => {
        nunjuckStatic.generateSubpage('/posts/' + post.slug, 'post.html', post)
    })

    return console.log('Created posts')
}

function createPages() {
    pages.forEach(page => {
        if (page.acf.errorpage) {
            return
        }

        if (page.acf.template === 'posts.html') {
            return nunjuckStatic.generateSubpage('/' + page.slug, page.acf.template, { posts, page })
        } else if (page.acf.template === 'portfolio.html') {
            return nunjuckStatic.generateSubpage('/' + page.slug, page.acf.template, { portfolioItems, page })
        } else {
            return nunjuckStatic.generateSubpage('/' + page.slug, page.acf.template, { page })
        }
    })

    return console.log('Created Pages.')
}

function create404() {
    console.log(notFound)
    nunjuckStatic.generateIndex('404.html', notFound)
}

function createHomepage() {
    nunjuckStatic.generateIndex('index.html', {
        articles: posts,
        homepage
    })

    return console.log('Created Homepage')
}

async function build(callback) {
    getAllPages().then(() => {
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