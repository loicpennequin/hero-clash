let Bookshelf = require('../../database'),
		Hero = require("../models/hero"),
		Heroes = Bookshelf.Collection.extend({
			model: Hero
		});

module.exports = Bookshelf.collection('Heroes', Heroes);
