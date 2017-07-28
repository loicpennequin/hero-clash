app.controller('battleCtrl', function($scope, $q, classFactory, userFactory, skillFactory, heroFactory, battleFactory, socket){
  $scope.gameType = "Ranked Game";
  $scope.user = {};
  $scope.opp = {};
  $scope.roster = [];
  $scope.userTeam = [];
  $scope.oppTeam = [];
  $scope.combatLog = [];

  $scope.ally1 = {};
  $scope.ally2 = {};
  $scope.ally3 = {};
  $scope.enemy1 = {};
  $scope.enemy2 = {};
  $scope.enemy3 = {};

  userFactory.loginCheck()
    .then(function(response){
      socket.emit('rdyToInit', 'ready',  (data) =>{
        Init(data.users, data.sessionID);
      });
    }, function(error){
      console.log(error);
    });

    function Init(users, sessionID){
      battleFactory.getGameState("mp")
        .then(function(response){
          if (response.data.state == false){
            console.log('no game to load, starting new game');
            users.forEach(function(user, index){
              userFactory.getUser(user.id)
              .then(function(response){
                if(response.data.id == sessionID){
                  $scope.user = response.data;
                }else{
                  $scope.opp = response.data;
                };
              }, function(error){
                console.log(error);
              })
            });
          } else {

          };
        }, function(error){
          console.log(error);
        });
    };

    function setMembersAndSkills(){
      let heroes = $scope.user.heroes,
          members = {},
          deferred = $q.defer();
      heroes.forEach(function(hero, index){
        for(let i = 1; i <=4 ; i++){
          let s = hero.skills.findIndex(item => item.id === hero['skill' + i]);
          hero['activeSkill' +i] = hero.skills[s];
        }
        hero.target = null;
        hero.skillAction = {};
      });
      for(let i = 1; i <=3 ; i++){
        members[i] = heroes.findIndex(item => item.id === $scope.user['team_slot' + i]);
        $scope.user['teamHero' + i] = $scope.user.heroes[members[i]];
      }
    }


});
