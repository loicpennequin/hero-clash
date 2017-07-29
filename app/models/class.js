let Bookshelf = require('../../database');

require('./hero');
require('./skill');

var Class = Bookshelf.Model.extend({
	tableName: "classes",
	heroes : function(){
		return this.hasMany('Hero');
	},
  skills : function(){
    return this.hasMany('Skill');
  }
});

module.exports = Bookshelf.model('Class', Class);
