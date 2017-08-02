let express = require('express'),
    Users = require('../collections/users'),
    User = require('../models/user'),
    Hero = require('../models/hero'),
    Class = require('../models/class'),
    Skill = require('../models/skill'),
    _ = require('lodash'),
    bcrypt = require('bcrypt-nodejs'),
    cookieParser = require('cookie-parser');

// Add free heroes to account
let addBasic = function(user){
  Class.query({where: {basic : '1'}})
  .fetchAll({withRelated : ['skills']})
  .then(function(classes){
    classes.forEach(function(elem,key){
      Skill.query({where: {basic : '1', class_id : elem.attributes.id}})
      .fetchAll()
      .then(function(skills){
        Hero.forge({
          user_id : user.attributes.id,
          class_id : elem.attributes.id
        })
        .save()
        .then(function(hero){
          skills.forEach(function(skill, index){
            hero.skills().attach(skill)
          });
        })
      })
    })
  })
}

exports.list = function(req, res){
  Users.forge()
  .fetch({withRelated: ['heroes.class']})
  .then(function (collection) {
    res.json({error: false, data: collection.toJSON()});
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
};

exports.show = function(req, res){
  User.forge({id : req.params.id})
  .fetch({withRelated: ['heroes.skills', 'heroes.class.skills'] })
  .then(function (user) {
    let data = user.toJSON();
    delete data.password;
    res.json({error: false, data: data});
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
};

exports.create = function(req,res){
  bcrypt.hash(req.body.password, null, null, function(err, hash) {
    User.forge({
      login : req.body.login,
      password : hash,
      email : req.body.email
    })
    .save()
    .then(function(user){
      addBasic(user)
      res.json({error: false, data: {message: 'signup was a success'} });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });
};

exports.signin = function(req,res){
  User.forge({login : req.body.login})
  .fetch()
  .then(function(user){
    if (!user){
      res.json({error: false, data: {message: 'wrong username'}});
    }else{
      bcrypt.compare(req.body.password, user.attributes.password, function(error, result) {
        if ( result === true){
          let userData = user.toJSON();
          delete userData.password;
          req.session.user = userData;
          req.session.user.trainingGame = {state : false};
          req.session.user.MPGame = {state : false};
          req.session.save();
          res.json({error: false, data: userData});
        } else {
          res.json({error: false, data: {message: 'wrong password'}});
        }
      });
    };
  })
  .catch(function (err) {
    res.status(500).json({error: true, data: {message: err.message}});
  });
}

exports.signoff = function(req, res){
  req.session.destroy()
  res.json({error: false, data: {message: 'logged off'}});
}

exports.logincheck = function(req, res){
  if (req.session.user){
    res.json({data : {user : req.session.user}})
  } else {
    res.json({error: false, data : {message : "not logged in"}})
  }
};
