const axios = require('axios')

const Api = axios.create({
    baseURL: 'https://api.gijslaarman.nl/wp-json/wp/v2/'
})

const get = {
    portfolioItems() {
        return Api.get('/portfolio_items').then(result => result.data)
    },
    homepage() {
        return Api.get('/pages').then(pages => {
            return pages.data.find(page => page.link === 'https://api.gijslaarman.nl/')
        })
    }
}

module.exports = get