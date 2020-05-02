const axios = require('axios')
const queryStringify = require('./helpers').queryStringify
require('dotenv').config()

const Api = axios.create({
    baseURL: process.env.apiUrl
})

module.exports = {
    async posts() {
        const posts = await Api.get('/posts')
        return posts.data
    },
    async post(slug) {
        const posts = await this.posts()
        const thisPost = posts.find(post => post.slug === slug)
        return thisPost
    },
    async pages(params) {
        var queryString = params ? queryStringify(params) : ''
        const pages = await Api.get(`/allpages?${queryString}`)
        return pages.data
    }
}