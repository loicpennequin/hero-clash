let Bookshelf = require('../../database'),
		User = require("../models/user"),
		Users = Bookshelf.Collection.extend({
			model: User
		});

module.exports = Bookshelf.collection('Users', Users);
