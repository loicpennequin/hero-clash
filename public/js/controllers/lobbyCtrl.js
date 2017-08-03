app.controller('lobbyCtrl', function($scope, $q, classFactory, userFactory, skillFactory, heroFactory, battleFactory, socket, $route, $location, $rootScope){
  $scope.user = {};
  $scope.roster = [];
  $scope.userTeam = [];
  $scope.oppTeam = [];
  $scope.combatLog = [];
  $scope.challenger = "";
  $scope.challengePending = false;
  $scope.challengeSent = false;
  $scope.notification = ""
  $scope.notificationDisplay = false;

  $scope.users = [];

  $scope.closeNotification = function(){
    $scope.notificationDisplay = false;
  }

  userFactory.loginCheck()
    .then(function(response){
      $scope.getUser(response.data.user.id)
      // Init(response.data.user.id);
    }, function(error){
      console.log(error);
    });

  $scope.getUser = function(id){
    userFactory.getUser(id)
      .then(function(response){
        $scope.user = response.data;
        socket.emit('joinLobby', $scope.user);
      }, function(error){
        console.log(error);
      });
  };

  $scope.$on('$routeChangeStart', function(){
    socket.emit('leaveLobby')
  });

  socket.on('userLeftLobby', function(data){
      $scope.users = data;
  });

  socket.on('lobbyJoined', function(data){
    $scope.users = data.members;
    $scope.user = data.user;
  });

  socket.on('updateMembers', function(data){
    $scope.users = data;
  });

  $scope.challenge = function(user){
    socket.emit('challenge', {challenger : $scope.user, challenged : user})
    $scope.challengeSent = true;
  };

  socket.on('challengePending', function(user){
    $scope.challengePending = true;
    $scope.challenger = user;
  });


  $scope.acceptChallenge = function(){
    let room = $scope.user.login + '-' + $scope.challenger.login;
    socket.emit('challengeAccepted', {users : [$scope.user, $scope.challenger], room : room});
  };

  $scope.declineChallenge = function(){
    $scope.challengePending = false;
    socket.emit('challengeDeclined', $scope.challenger)
  };

  socket.on('challengeDeclined', function(data){
    $scope.notification = data.message
    $scope.notificationDisplay = true;
    $scope.challengeSent = false;
  });

  socket.on('gameStart', function(response){
    $rootScope.gameData = response;
    $location.path('/play/game');
  });

});
