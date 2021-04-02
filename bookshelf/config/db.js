const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Jeishu.23@',
        database: 'bookshelf_db',
        charset: 'utf8'
    }
});

module.exports.knex = knex;