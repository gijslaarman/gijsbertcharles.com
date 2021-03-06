const nunjuckStatic = require('./nunjuckStatic.js')
const postFormatter = require('./helpers').postFormatter

function getFolderPath(body) {
    switch(body.model) {
        case 'post':
            return `/posts/${body.entry.slug}`
        case 'project':
            return `/project/${body.entry.slug}`
        case '404':
        case 'homepage':
            return 'index'
        default:
            return `/${body.model}` // If it's anything else, return a path with this model name. E.g: 'about-me' will be /about-me
    }
}

function generateEntry(body) {
    const path = getFolderPath(body) // Get the folder path of this entry.
    const post = postFormatter(body.entry)

    if (path === 'index') {
        nunjuckStatic.generateIndex(`${body.model}.html`, { entry: post })
    } else {
        nunjuckStatic.generateSubpage(path, `${body.model}.html`, { entry: post })
    }
}

function checkEvent(event) {
    switch (event) {
        case 'entry.create':
        case 'entry.update':
            // (Re)Build this page.
            return 'build'
        case 'entry.delete':
            return 'delete'
            // Delete this page
        default:
            return 'unknown'
    }
}

module.exports = function (body) {
    const action = checkEvent(body.event)

    if (action === 'build') {
        generateEntry(body)
    } else if (action === 'delete') {
        // Search for what the delete
    } else {
        console.error('Unknown action')
        // unknown
    }
}