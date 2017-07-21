let Bookshelf = require('../../database'),
		Skill = require("../models/skill"),
		Skills = Bookshelf.Collection.extend({
			model: Skill
		});

module.exports = Bookshelf.collection('Skills', Skills);
