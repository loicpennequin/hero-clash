var app = angular.module('heroApp', ['ngAnimate', 'ngSanitize', 'ngRoute']).constant('_', window._);


app.config(function($routeProvider){
  $routeProvider
    .when('/', {templateUrl: 'views/home.html'})
    .when('/login', {templateUrl: 'views/login.html'})
    .when('/shop', {templateUrl: 'views/shop.html'})
})
.run(function(userFactory, $location){
  userFactory.loginCheck()
    .then(function(response){
      if (!response.data.user){
        $location.path('/login')
      }
    })
})
