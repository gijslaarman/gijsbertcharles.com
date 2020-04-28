const axios = require('axios')
require('dotenv').config()

const Api = axios.create({
    baseURL: process.env.apiUrl
})

const get = {
    portfolioItems() {
        return Api.get('/portfolio_items').then(result => result.data)
    },
    posts() {
        return Api.get('/posts').then(result => result.data)
    },
    async post(slug) {
        const posts = await this.posts()
        const thisPost = posts.find(post => post.slug === slug)
        return thisPost
    },
    homepage() {
        return Api.get('/pages').then(pages => {
            return pages.data.find(page => page.link === 'https://api.gijslaarman.nl/')
        })
    }
}

module.exports = get