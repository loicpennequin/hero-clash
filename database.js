// database.js
'use strict';

let password = require("./password.js").password,
    knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : '127.0.0.1',
        user     : 'root',
        password : password,
        database : 'heroclash',
        charset  : 'utf8'
    }
    }),
    bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry'); // Resolve circular dependencies with relations

module.exports = bookshelf;
