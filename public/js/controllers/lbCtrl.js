app.controller('lbCtrl', function($scope, userFactory, $location){
  $scope.users = {};

  $scope.getUsers = function(){
    userFactory.getUsers()
      .then(function(response){
        $scope.users = response.data;
        $scope.users.forEach(function(user,key){
          let index1 = user.heroes.findIndex(item => item.id === $scope.user.team_slot1);
              index2 = user.heroes.findIndex(item => item.id === $scope.user.team_slot2),
              index3 = user.heroes.findIndex(item => item.id === $scope.user.team_slot3);
          user.teamHero1 = user.heroes[index1]
          user.teamHero2 = user.heroes[index2]
          user.teamHero3 = user.heroes[index3]
        })
      }, function(error){
        console.log(error);
      })
  };
  $scope.getUsers();

  userFactory.loginCheck().then(function(response){
    if (response.data.user){
      $scope.loggedIn = true;
      $scope.user = response.data.user;
      if ( $location.path() == "/login"){
        $location.path('/')
      }
    };
  });

});
