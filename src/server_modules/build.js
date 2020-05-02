const nunjuckStatic = require('./nunjuckStatic.js')
const get = require('./api')
const logger = require('./helpers').logger
const getPath = require('./helpers').getPath
const postFormatter = require('./helpers').postFormatter

const create = {
    pages: async function() {
        const pages = await get.pages()

        pages.forEach(page => {
            const template = page.page_settings.page_template.template
            const path = getPath(page.page_settings.slug)

            if (path === 'index') {
                nunjuckStatic.generateIndex(template, { entry: page })
                logger('green', `Build: ${template}`)
            } else {
                nunjuckStatic.generateSubpage(path, template, { entry: page })
                logger('green', `Build: ${path}`)
            }
        })
    },

    posts: async function() {
        const posts = await get.posts()
    
        posts.forEach(post => {
            post = postFormatter(post)

            nunjuckStatic.generateSubpage(`/posts/${post.slug}`, 'post.html', { entry: post })
            logger('green', `Build: /posts/${post.slug}`)
        })
    }
    //,
    // // Add in more actions here
    // yourAction: async function() {
    //  // What to do.
    //}
}

module.exports = function (callback) {
    logger('yellow', '====== \nBuilding \n====== \n')
    const promises = []

    for (let [key, value] of Object.entries(create)) {
        promises.push(value.call())
    }

    Promise.all(promises).then(() => {
        callback()
    })
}