let Bookshelf = require('../../database');

require('./hero');

var User = Bookshelf.Model.extend({
	tableName: "users",
	heroes : function(){
		return this.hasMany('Hero');
	}
});

module.exports = Bookshelf.model('User', User);
