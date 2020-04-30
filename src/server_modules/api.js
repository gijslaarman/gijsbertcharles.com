const axios = require('axios')
require('dotenv').config()

const Api = axios.create({
    baseURL: process.env.apiUrl
})

const get = {
    portfolioItems() {
        return Api.get('/portfolio_items').then(result => result.data)
    },
    async notFound() {
        const pages = await Api.get('/pages')
        const filtered = pages.data.find(page => page.acf.errorpage)
        return filtered
    },
    async categories(filter) {
        const categories = await Api.get('/categories')

        if (filter) {
            // HOW FILTER: [1, 4, 5]
            const array = []
            filter.forEach(id => {
                array.push(categories.data.find(category => category.id == id))
            })
            return array
        } else {
            return categories.data
        }
    },
    posts() {
        return Api.get('/posts').then(result => result.data)
    },
    async post(slug) {
        const posts = await this.posts()
        const thisPost = posts.find(post => post.slug === slug)
        return thisPost
    },
    async pages() {
        const pages = await Api.get('/pages')
        const filtered = pages.data.filter(page => page.link !== process.env.HOMEPAGE)
        return filtered
    },
    homepage() {
        return Api.get('/pages').then(pages => {
            return pages.data.find(page => page.link === process.env.HOMEPAGE)
        })
    }
}

module.exports = get