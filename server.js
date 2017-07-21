'use strict';

const express = require('express'),
    app = express(),
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
      hero = require('./app/routeHandler/hero')

app.get('/api/users', user.list);
app.get('/api/users/:id', user.show);
app.post('/api/users', user.create);
app.post('/api/signin', user.signin);
app.get('/api/signoff', user.signoff)
app.get('/api/loggedin', user.logincheck)

app.get('/api/heroes', hero.list);
app.get('/api/heroes/:id', hero.show);

//////// 404
// app.use(function(req, res, next){
//       res.setHeader('Content-Type', 'text/plain');
//       res.send(404, 'Page introuvable !');
// });

app.listen(port, ()=>{
  console.log('server is running at port ' + port);
});
