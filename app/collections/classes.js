let Bookshelf = require('../../database'),
		Class = require("../models/class"),
		Classes = Bookshelf.Collection.extend({
			model: Class
		});

module.exports = Bookshelf.collection('Classes', Classes);
