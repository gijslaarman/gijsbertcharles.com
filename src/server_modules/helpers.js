const helpers = {
    filterBy: function(filterBy, whatToFilter, filterArray) {
        const array = []
        filterArray.forEach(filterItem => { array.push(whatToFilter.find(what => what[filterBy] == filterItem)) })
        return array
    }
}

module.exports = helpers