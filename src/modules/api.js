const axios = require('axios')

const Api = axios.create({
    baseURL: 'https://api.gijslaarman.nl/wp-json/wp/v2/'
})

const get = {
    portfolioItems() {
        return Api.get('/portfolio_items').then(result => result.data)
    }
}

module.exports = get