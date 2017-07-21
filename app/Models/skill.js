let Bookshelf = require('../../database');

require('./class');
require('./hero');

var Skill = Bookshelf.Model.extend({
	tableName: "skills",
	class : function(){
		return this.belongsTo('Class');
	},
	heroes : function(){
		return this.belongsToMany('Heroes', 'heroes_skill', 'skill_id', 'hero_id');
	}
});

module.exports = Bookshelf.model('Skill', Skill);
