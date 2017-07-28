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
      job = require('./app/routeHandler/class'),
      game = require('./app/routeHandler/gamestate');

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

app.get('/api/gamestate/training', game.trainingLoad)
app.post('/api/gamestate/training', game.trainingSave)

/*========================================SOCKET.IO=========================================*/

io.on('connection', function(socket){

/*========================================LOBBY=============================================*/

  socket.on('joinLobby', function(user){

    socket.handshake.session.reload(function(err) {
      socket.user = socket.handshake.session.user;
      socket.user.socketID = socket.id;
      socket.join('lobby');

      // console.log(io.sockets.connected[socket.id].user);

      let lobbySockets = io.sockets.adapter.rooms['lobby'],
          lobby = Object.keys(lobbySockets.sockets),
          members = [];

      lobby.forEach(function(member, key){
        members.push(io.sockets.connected[member].user)
      })

      io.to(socket.id).emit('lobbyJoined', {user: socket.user, members : members});
      socket.broadcast.emit('updateMembers', members);
    });
  });

  socket.on('leaveLobby', function(data){
    socket.leave('lobby');
    let lobbySockets = io.sockets.adapter.rooms['lobby'];
        if(lobbySockets && lobbySockets.length > 0){
          let lobby = Object.keys(lobbySockets.sockets),
              members = [];

          lobby.forEach(function(member, key){
            members.push(io.sockets.connected[member].user)
          })


          io.emit('userLeftLobby', members)
        }

  })

  socket.on('challenge', function(data){
    socket.broadcast.to(data.challenged.socketID).emit('challengePending', data.challenger);
  });

  socket.on('challengeDeclined', function(data){
    socket.broadcast.to(data.socketID).emit('challengeDeclined', {message : data.login + ' has refused your challenge.'});
  });

  socket.on('challengeAccepted', function(data){
    data.forEach(function(user, index){
      io.to(user.socketID).emit('gameStart');
    })

  });


/*=======================================GAME LOGIC===========================================*/

  socket.on('action', function (data, ackFn) {
    let combatLog = [],
        heroes = data.heroes,
        actor = data.actor,
        actorIndex = heroes.findIndex(item => item.id === actor.id),
        response = {},
        targetIndex = heroes.findIndex(item => item.id === data.actor.target),
        target = heroes[targetIndex],
        skillAction = require('./app/skillActions/skillActions');

    //checking for dots
    if (actor.dotCounter){
      let dotOriginIndex = heroes.findIndex(item => item.id === actor.dotOrigin);
      skillAction.applyDot(false, actor.dotOrigin, heroes[actorIndex], combatLog)
    };

    //checking for hots
    if (actor.hotCounter){
      let hotOriginIndex = heroes.findIndex(item => item.id === actor.hotOrigin);
      skillAction.applyHot(false, actor.hotOrigin, heroes[actorIndex], combatLog)
    };


    switch (actor.action){
      case 'attack':
        let dmg = actor.atk - target.def;

        if(dmg < 10){
          dmg = 10;
        }

        target.hp -= dmg;
        combatLog.push(actor.class.name + ' attacked ' + target.class.name + ', dealing ' + dmg + ' damage.');
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
        //decrease buff and deletes them if 0
        if (hero.buffCounter){
          hero.buffCounter --;
          if (hero.buffCounter <= 0){
            combatLog.push(hero.buffOrigin + ' has ended on ' + hero.class.name + '.')
            delete hero.buffCounter;
            delete hero.buffOrigin;
            for (let i = 1 ; i <= 4 ; i++){
              hero[hero['buff' + i + 'stat']] -= hero['buff' + i + 'value'];
              delete hero['buff' + i + 'stat'];
              delete hero['buff' + i + 'value'];
            }
          }
        };

        //decrease debuff and deletes them if 0
        if (hero.debuffCounter){
          hero.debuffCounter --;
          if (hero.debuffCounter <= 0){
            combatLog.push(hero.debuffOrigin + ' has ended on ' + hero.class.name + '.')
            delete hero.debuffCounter;
            delete hero.debuffOrigin;
            for (let i = 1 ; i <= 4 ; i++){
              hero[hero['debuff' + i + 'stat']] -= hero['debuff' + i + 'value'];
              delete hero['debuff' + i + 'stat'];
              delete hero['debuff' + i + 'value'];
            }
          }
        };

        //remove dead heroes
        if (hero.hp <= 0){
          let index = heroesCopy.indexOf(hero);
          heroes.splice(index, 1);
          combatLog.push(hero.class.name + ' has been defeated!')
        } else {

        //remove 'defend' buff
        if(hero.action == 'defend'){
          hero.def -= 20;
        }

        //resets parameters
          hero.skillAction = {};
          hero.target = null;
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
