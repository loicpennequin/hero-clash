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
        });
      }else if(req.params.slot == '2'){
        user.save({
          team_slot2: hero.attributes.id
        });
      }else if(req.params.slot == '3'){
        user.save({
          team_slot3: hero.attributes.id
        });
      };
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

exports.setActiveSkill = function(req, res){
  Hero.forge({id : req.body.hero})
  .fetch()
  .then(function(hero){
    if(req.params.slot == '1'){
      hero.save({
        skill1 : req.body.skill
      });
    } else if (req.params.slot == '2'){
      hero.save({
        skill2 : req.body.skill
      });
    } else if (req.params.slot == '3'){
      hero.save({
        skill3 : req.body.skill
      });
    } else if (req.params.slot == '4'){
      hero.save({
        skill4 : req.body.skill
      });
    };
    res.json({error: false, data: {message: 'active skill set successfully'}})
  })
}

exports.listFromUser = function(req, res){
  Hero.query({where: {user_id : req.params.id}})
  .fetchAll({withRelated : ['class']})
  .then(function(heroes){
    res.json({error: false, data: heroes.toJSON()});
  })
}
