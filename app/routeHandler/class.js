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
}

exports.buy = function(req,res){
  let gold = parseInt(req.session.user.gold),
      price = req.body.price;
  if( gold < price){
    res.json({error: false, data: {message: 'Sorry, not enough diamonds'}});
  }else{
    let newGold = gold - price;
    User.forge({id : req.session.user.id})
    .fetch()
    .then(function(user){
      user.save({
        gold : newGold
      });
      Hero.forge({
        user_id : req.session.user.id,
        class_id : req.body.id
      })
      .save()
      .then(function(hero){
        Skill.query({where: {basic : '1', class_id : hero.attributes.class_id}})
        .fetchAll()
        .then(function(skills){
          let newGold = gold - hero.attributes.price;
          skills.forEach(function(skill, index){
            hero.skills().attach(skill)
          });
          res.json({error: false, data: {message: 'Hero purchased'} });
        })
      })
    })
  };
};
