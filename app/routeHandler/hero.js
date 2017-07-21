const express = require('express'),
    Heros = require('../collections/heroes'),
    Hero = require('../models/hero'),
    Class = require('../models/class'),
    Skill = require('../models/skill'),
    User = require('../models/user')
    _ = require('lodash')

exports.list = function(req, res){
  Heroes.forge()
  .fetch({withRelated : ['classes', 'skills']})
  .then(function (collection) {
    res.json({error: false, data: collection.toJSON()});
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
};

exports.show = function(req, res){
  Hero.forge()
  .fetch({withRelated : ['classes', 'skills']})
  .then(function (collection) {
    res.json({error: false, data: collection.toJSON()});
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
};
