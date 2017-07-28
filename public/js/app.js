var app = angular.module('heroApp', ['ngAnimate', 'ngSanitize', 'ngRoute']).constant('_', window._);


app.config(function($routeProvider){
  $routeProvider
    .when('/', {templateUrl: 'views/home.html'})
    .when('/login', {templateUrl: 'views/login.html'})
    .when('/shop', {templateUrl: 'views/shop.html'})
    .when('/leaderboards', {templateUrl: 'views/leaderboards.html'})
    .when('/play/training', {templateUrl: 'views/battle.html', controller: 'trainingCtrl'})
    .when('/play/game', {templateUrl: 'views/battle.html', controller: 'battleCtrl'})
    .when('/play/lobby', {templateUrl: 'views/lobby.html'})
})
.run(function(userFactory, $location){
  userFactory.loginCheck()
    .then(function(response){
      if (!response.data.user){
        $location.path('/login')
      }
    })
})
