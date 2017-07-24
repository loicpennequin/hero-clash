'use strict';

let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),

    bcrypt = require('bcrypt-nodejs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),

    Bookshelf = require('./database'),
    fs = require('fs'),

    port = 8080,
    secret = require("./password.js").secret

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: secret, resave : false, saveUninitialized : true}))
app.use(express.static('public'));


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
    let combatLog = "",
        heroes = data.heroes,
        actor = data.actor;

    switch (actor.action){
      case 'attack':
        let dmg = actor.atk - actor.target.def;
        if(dmg < 10){
          dmg = 10;
        }
        let target = heroes.findIndex(item => item.id === actor.target.id);
        heroes[target].hp -= dmg;
        combatLog = (actor.class.name + ' attacked ' + actor.target.class.name + ', dealing ' + dmg + ' damage.');
        break;
      case 'skill':
        combatLog = (actor.class.name + ' used ' + actor.skillAction.name + ' on ' + actor.target.class.name + '.');
        break;
      case 'defend' :
        combatLog = (actor.class.name + ' defends.');
        break;
      case 'wait' :
        combatLog = (actor.class.name + ' waits.');
        break;
    };
    let response = {heroes: heroes, combatLog: combatLog}
    ackFn(response)
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
