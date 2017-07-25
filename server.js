'use strict';

let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),

    bcrypt = require('bcrypt-nodejs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    secret = require("./password.js").secret,
    session = require('express-session'),
    sessionParams = session({secret: secret, resave : false, saveUninitialized : true}),
    ios = require('socket.io-express-session'),

    Bookshelf = require('./database'),
    fs = require('fs'),

    port = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(sessionParams)
app.use(express.static('public'));
io.use(ios(sessionParams));

/*=========================================ROUTING======================================*/
const user = require('./app/routeHandler/user'),
      hero = require('./app/routeHandler/hero'),
      skill = require('./app/routeHandler/skill'),
      job = require('./app/routeHandler/class');

app.get('/api/users', user.list);
app.get('/api/users/:id', user.show);
app.post('/api/users', user.create);
app.post('/api/signin', user.signin);
app.get('/api/signoff', user.signoff)
app.get('/api/loggedin', user.logincheck)

app.get('/api/heroes', hero.list);
app.get('/api/heroes/:id', hero.show);
app.put('/api/heroes/team/:slot', hero.setTeamMember);
app.put('/api/heroes/activeskill/:slot', hero.setActiveSkill);
app.get('/api/heroes/user/:id', hero.listFromUser);

app.get('/api/skills/buy', skill.buy)

app.get('/api/classes', job.list)
app.post('/api/classes/buy', job.buy)

/*========================================SOCKET.IO=========================================*/

io.on('connection', function(socket){

  socket.on('action', function (data, ackFn) {
    let combatLog = [],
        heroes = data.heroes,
        actor = data.actor,
        actorIndex = heroes.findIndex(item => item.id === actor.id),
        response = {},
        skillAction = require('./app/skillActions/skillActions');

    //checking for dots
    if (actor.dotCounter){
      let dotOriginIndex = heroes.findIndex(item => item.id === actor.dotOrigin);
      skillAction.applyDot(false, actor.dotOrigin, heroes[actorIndex], combatLog)
    };


    switch (actor.action){
      case 'attack':
        let dmg = actor.atk - actor.target.def,
            target = heroes.findIndex(item => item.id === actor.target.id);

        if(dmg < 10){
          dmg = 10;
        }

        heroes[target].hp -= dmg;
        combatLog.push(actor.class.name + ' attacked ' + actor.target.class.name + ', dealing ' + dmg + ' damage.');
        response = {heroes: heroes, combatLog: combatLog};
        break;

      case 'skill':
        let result = skillAction.skill(actor.skillAction, actor, heroes);
        result.combatLog.forEach(function(log, index){
          combatLog.push(log)
        });
        response.heroes = result.heroes;
        response.combatLog = combatLog;
        break;

      case 'defend' :
        heroes[actorIndex].def += 20;
        combatLog.push(actor.class.name + ' defends, gaining 20 DEF for the turn.');
        response = {heroes: heroes, combatLog: combatLog}
        break;

      case 'wait' :
        heroes[actorIndex].mp += 10;
        if(heroes[actorIndex].mp > heroes[actorIndex].class.mana){
          heroes[actorIndex].mp = heroes[actorIndex].class.mana
        };
        combatLog.push(actor.class.name + ' waits, regaining 10 MP.');
        response = {heroes: heroes, combatLog: combatLog}
        break;
    };

    ackFn(response)
  });

  socket.on('endTurn', function (data, ackFn){
    socket.handshake.session.reload(function(err) {
      let userTeam = [],
      oppTeam = [],
      combatLog = [],
      heroes = data.heroes,
      heroesCopy = data.heroes.slice(0),
      response;

      heroesCopy.forEach(function(hero, index){
        if (hero.hp <= 0){
          let index = heroesCopy.indexOf(hero);
          heroes.splice(index, 1);
          combatLog.push(hero.class.name + ' has been defeated!')
        } else {
          if(hero.action == 'defend'){
            hero.def -= 20;
          }
          hero.skillAction = {};
          hero.target = {};
          if(hero.user_id == socket.handshake.session.user.id){
            userTeam.push(hero)
          }else{
            oppTeam.push(hero)
          };
        };
      });
      combatLog.push('--------End of the Turn---------');
      response = {heroes: heroes, userTeam: userTeam, oppTeam: oppTeam, combatLog: combatLog};

      ackFn(response)
    });
  });
});

//////// 404
// app.use(function(req, res, next){
//       res.setHeader('Content-Type', 'text/plain');
//       res.send(404, 'Page introuvable !');
// });

http.listen(port, ()=>{
  console.log('server is running at port ' + port);
});
