let express = require('express'),
    Class = require('../models/class'),
    Classes = require('../collections/classes'),
    Hero = require('../models/hero'),
    Skill = require('../models/skill'),
    User = require('../models/user')
    _ = require('lodash')

exports.list = function(req, res){
  Classes.forge()
  .fetch({withRelated : ['heroes', 'skills']})
  .then(function (collection) {
    res.json({error: false, data: collection.toJSON()});
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
};
