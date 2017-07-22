let express = require('express'),
    Hero = require('../models/hero'),
    Skill = require('../models/skill'),
    User = require('../models/user'),
    Skills = require('../collections/skills'),
    _ = require('lodash');

exports.buy = function(req, res){
  User.forge({id : req.session.user.id})
  .fetch()
  .then(function(user){
    Hero.forge({id : req.query.hero})
    .fetch()
    .then(function(hero){
      Skill.forge({id : req.query.skill})
      .fetch()
      .then(function(skill){
        let gold = parseInt(user.attributes.gold);
        if( gold < skill.attributes.price){
          res.json({error: false, data: {message: 'Sorry, not enough diamonds'}});
        }else{
          let newGold = gold - skill.attributes.price;
          hero.skills().attach(skill);
          user.save({
            gold : newGold
          })
          .then(function(){
            res.json({error: false, data: {message: 'Skill purchased'}});
          })
        };
      })
    })
  })
};
