const showdown = require('showdown')
const converter = new showdown.Converter()
const dayjs = require('dayjs')

module.exports = {
    filterBy: function(filterBy, whatToFilter, filterArray) {
        const array = []
        filterArray.forEach(filterItem => { array.push(whatToFilter.find(what => what[filterBy] == filterItem)) })
        return array
    },
    logger: function(color, msg) {
        switch(color) {
            case 'red':
                return console.log(`\x1b[31m${msg}\x1b[0m`)
            case 'green':
                return console.log(`\x1b[32m${msg}\x1b[0m`)
            case 'yellow':
                return console.log(`\x1b[33m${msg}\x1b[0m`)
            case 'purple':
                return console.log(`\x1b[34m${msg}\x1b[0m`)
        }
    },
    queryStringify: function(params) {
        return Object.keys(params).map(key => key + '=' + params[key]).join('&')
    },
    getPath: function(slug) {
        switch(slug) {
            case '404':
            case 'homepage':
                return 'index'
            default:
                return `/${slug}`
        }
    },
    postFormatter: function(post) {
        post.last_updated = dayjs(post.updated_at).format('DD MMM, YYYY')

        if (post.markdown) {
            post.markdown = post.markdown.map(block => converter.makeHtml(block.content))
        }

        return post
    }
}