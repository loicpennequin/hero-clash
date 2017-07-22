let express = require('express'),
    Heroes = require('../collections/heroes'),
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

exports.setTeamMember = function(req, res){
  Hero.forge({id : req.body.id})
  .fetch()
  .then(function(hero){
    User.forge({id : req.session.user.id})
    .fetch()
    .then(function(user){
      if(req.params.slot == '1'){
        user.save({
          team_slot1: hero.attributes.id
        })
      }else if(req.params.slot == '2'){
        user.save({
          team_slot2: hero.attributes.id
        })
      }else if(req.params.slot == '3'){
        user.save({
          team_slot3: hero.attributes.id
        })
      }
      res.json({error: false, data: {message: 'team member added'}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
}
