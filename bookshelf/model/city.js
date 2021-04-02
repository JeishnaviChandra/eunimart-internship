const knex = require('../config/db').knex;
const bookshelf = require('bookshelf')(knex);

const City = bookshelf.Model.extend({
    tableName: 'cities'
});

module.exports = City;