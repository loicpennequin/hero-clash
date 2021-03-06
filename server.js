'use strict';

const express = require('express'),
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
    Elo = require( 'elo-js' ),

    port = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(sessionParams);
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
app.get('/api/gamestate/mp', game.mpLoad)
app.post('/api/gamestate/mp', game.mpSave)


/*========================================LOBBY=============================================*/
io.on('connection', function(socket){

  socket.on('disconnect', function(){
    if(socket.handshake.session.user){
      if(socket.handshake.session.user.MPGame.state === true){
        loserRewards(false, socket.handshake.session)
        socket.handshake.session.user.MPGame.state = false;
        socket.handshake.session.save();
      };
    };
  });

  socket.on('joinLobby', function(user){
    socket.handshake.session.reload(function(err) {
      socket.user = socket.handshake.session.user;
      socket.user.socketID = socket.id;
      socket.handshake.session.save();
      socket.join('lobby');

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
      });

      io.emit('userLeftLobby', members)
    };

  })

  socket.on('challenge', function(data){
    socket.broadcast.to(data.challenged.socketID).emit('challengePending', data.challenger);
  });

  socket.on('challengeDeclined', function(data){
    socket.broadcast.to(data.socketID).emit('challengeDeclined', {message : data.login + ' has refused your challenge.'});
  });


  /*================================== RANKED GAME LOGIC=======================================*/

  socket.on('challengeAccepted', function(data){
    let room = data.room,
        users = data.users;

    users.forEach(function(user, index){
      io.sockets.connected[user.socketID].leave('lobby');
      io.sockets.connected[user.socketID].join(room);
      io.sockets.connected[user.socketID].handshake.session.user.MPGame.state = true;
      io.sockets.connected[user.socketID].handshake.session.save();
      io.to(user.socketID).emit('gameStart', {users : users, room : room});
    })
  });

  socket.on('rdyToInit', function(data){
    let room = data.room,
        users = data.users,
        sessionID = socket.handshake.session.user.id;

    io.to(socket.id).emit('init', {users : users, sessionID : sessionID});
  });

  socket.on('confirmTurn', function(room){
    socket.handshake.session.reload(function(err) {
      socket.user = socket.handshake.session.user;
      socket.user.turnConfirmed = true;
      socket.handshake.session.save();
      let gameRoom = io.sockets.adapter.rooms[room],
          gameRoomPlayers = Object.keys(gameRoom.sockets);

      function waitingForPlayerConfirms(elem){
        return !io.sockets.connected[elem].user.turnConfirmed
      }

      if (gameRoomPlayers.some(waitingForPlayerConfirms)){
        socket.emit('waitingForOpp')
      } else {
        io.to(room).emit('rdyToResolve')
        gameRoomPlayers.forEach(function(player, index){
          delete io.sockets.connected[player].user['turnConfirmed'];
        });
      };
    });
  });

  socket.on('resolveTurn', function(jsonData){
    socket.user = socket.handshake.session.user;
    let data = JSON.parse(jsonData);
    socket.turnData = data.turnData
    socket.handshake.session.save();
    let gameRoom = io.sockets.adapter.rooms[data.room],
        gameRoomPlayers = Object.keys(gameRoom.sockets),
        heroes = [],
        gameplay = require('./app/gameplay/gameLogic');

    function waitingForPlayerTurns(elem){
      return !io.sockets.connected[elem].turnData
    }

    if (!gameRoomPlayers.some(waitingForPlayerTurns)){
      gameRoomPlayers.forEach(function(player, index){
        heroes = heroes.concat(io.sockets.connected[player].turnData)
      });

      heroes = gameplay.sortHeroes(heroes);

      heroes.forEach(function(hero, index){
        io.to(data.room).emit('actionResolved', gameplay.resolveAction(heroes, hero));
      })

      gameRoomPlayers.forEach(function(player, index){
        delete io.sockets.connected[player]['turnData'];
      });

      endTurn(heroes, gameRoomPlayers, data.room, gameplay);

    };
  });

  function endTurn(heroes, players, room, gameplay){
    if (gameplay.endTurn({heroes : heroes}).winner){
      console.log("let's end the game");
      let winner, loser;
      players.forEach(function(player, index){
        if (io.sockets.connected[player].user.id == gameplay.endTurn({heroes : heroes}).winner){
          winner = io.sockets.connected[player];
        }else{
          loser = io.sockets.connected[player];
        }
        io.sockets.connected[player].handshake.session.user.MPGame.state = false;
        io.sockets.connected[player].handshake.session.save();
        io.sockets.connected[player].leave(room);
      });
      winnerRewards(winner, loser);
      if (loser){
        loserRewards(winner, loser);
      };
    } else {
      io.to(room).emit('endTurn', gameplay.endTurn({heroes : heroes}));
    };
  }

  function winnerRewards(winner, loser){
    let elo = new Elo();
    let User = require('./app/models/user');
    if (loser){
      var winnerRating = winner.user.elo,
          loserRating = loser.user.elo,
          winnerNewRating = elo.ifWins( winnerRating, loserRating );
    } else {
      winnerNewRating = winnerRating + 15;
    };

    User.forge({id : winner.user.id})
    .fetch()
    .then(function(user){
      user.save({
        games : user.attributes.games + 1,
        wins : user.attributes.wins + 1,
        gold : user.attributes.gold +=25,
        elo : winnerNewRating
      })
      .then(function(newUser){
        let socketSession = io.sockets.connected[winner.user.socketID].handshake.session;
        socketSession.user.elo = newUSer.attributes.elo
        socketSession.save();
        io.to(winner.user.socketID).emit('gameWon', "you won");
        console.log('winner : ' + winner.user.socketID);
      })
    });
  };

  function loserRewards(winner, loser){
    let elo = new Elo();
    let User = require('./app/models/user');
    if (loser){
      var winnerRating = winner.user.elo,
          loserRating = loser.user.elo,
          loserNewRating = elo.ifLoses( loserRating, winnerRating );
    } else {
      LoserNewRating = loserRating - 15;
    };

    User.forge({id : loser.user.id})
    .fetch()
    .then(function(user){
      user.save({
        games : user.attributes.games + 1,
        losses : user.attributes.losses + 1,
        gold : user.attributes.gold +=10,
        elo : loserNewRating
      })
      .then(function(){
        let socketSession = io.sockets.connected[winner.user.socketID].handshake.session;
        socketSession.user.elo = newUSer.attributes.elo
        socketSession.save();
        io.to(loser.user.socketID).emit('gameLost', "you lost");
        console.log('loser : ' + loser.user.socketID);
      })
    });
  };




/*====================================TRAINING GAME LOGIC=================================*/

  socket.on('action', function (data, ackFn) {
    let gameplay = require('./app/gameplay/gameLogic');

    ackFn(gameplay.resolveTurn(data))
  });

/*=====================================END TURN LOGIC=====================================*/

  socket.on('endTurn', function (data, ackFn){
    socket.handshake.session.reload(function(err) {
      let gameplay = require('./app/gameplay/gameLogic');


      ackFn(gameplay.endTurn(data))
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
