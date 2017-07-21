let Bookshelf = require('../../database');

require('./class');
require('./skill');

var Hero = Bookshelf.Model.extend({
	tableName: "heroes",
	class : function(){
		return this.belongsTo('Class');
	},
	skills : function(){
		return this.belongsToMany('Skill', 'heroes_skills', 'hero_id', 'skill_id');
	}
});

module.exports = Bookshelf.model('Hero', Hero);
