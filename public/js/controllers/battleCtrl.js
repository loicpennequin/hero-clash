app.controller('battleCtrl', function($scope, $q, classFactory, userFactory, skillFactory, heroFactory, battleFactory, socket, $rootScope, $interval){
  $scope.gameType = "Ranked Game";
  $scope.user = {};
  $scope.opp = {};
  $scope.roster = [];
  $scope.userTeam = [];
  $scope.oppTeam = [];
  $scope.combatLog = [];
  $scope.message = "";
  $scope.gameover;
  $scope.gameResult;

  $scope.waitingForOpp = false;
  $scope.turnConfirmed = false;
  $scope.timerWarning = false;
  $scope.notInGame = true;

  $scope.ally1 = {};
  $scope.ally2 = {};
  $scope.ally3 = {};
  $scope.enemy1 = {};
  $scope.enemy2 = {};
  $scope.enemy3 = {};

  $scope.timer = 60;

  $scope.countdown;
  $scope.setCountdown = function(){
    $scope.countdown = $interval(function(){
      $scope.timer -= 0.05;
      if ($scope.timer < 10) $scope.timerWarning = true;
      if ($scope.timer < 0){
        setDefaultTurn();
      }
      $scope.getTimerWidth();
    }, 50);
  };

  $scope.getTimerWidth = function(){
      return { width : (100 * $scope.timer) / 60 + '%' };
  };

  userFactory.loginCheck()
    .then(function(response){
      console.log(response);
      if (response.data.user.MPGame.state == true){
        $scope.notInGame = false;
        socket.emit('rdyToInit', $rootScope.gameData);
      }
    }, function(error){
      console.log(error);
    });


  socket.on('init', function(data){
    let users = data.users,
        sessionID = data.sessionID;
    $scope.setCountdown();
    users.forEach(function(user, index){
      userFactory.getUser(user.id)
        .then(function(response){
          if(response.data.id == sessionID){
            $scope.user = response.data;
            setMembersAndSkills($scope.user);
            setTeams($scope.user, $scope.userTeam);
            $scope.roster = $scope.roster.concat($scope.userTeam);
          }else{
            $scope.opp = response.data;
            setMembersAndSkills($scope.opp, $scope.oppTeam);
            setTeams($scope.opp, $scope.oppTeam);
            $scope.roster = $scope.roster.concat($scope.oppTeam)
          };
        }, function(error){
          console.log(error);
        });
    });
  });

  function setMembersAndSkills(user){
    let heroes = user.heroes,
        members = {};
    heroes.forEach(function(hero, index){
      for(let i = 1; i <=4 ; i++){
        let s = hero.skills.findIndex(item => item.id === hero['skill' + i]);
        hero['activeSkill' +i] = hero.skills[s];
      }
      hero.target = null;
      hero.skillAction = {};
    });
    for(let i = 1; i <=3 ; i++){
      members[i] = heroes.findIndex(item => item.id === user['team_slot' + i]);
      user['teamHero' + i] = user.heroes[members[i]];
    }
  }

  function setTeams(user, team){
      team.push(user.teamHero1, user.teamHero2, user.teamHero3);
      team.forEach(function(hero, index){
        hero.hp = hero.class.health;
        hero.mp = hero.class.mana;
        hero.atk = hero.class.atk;
        hero.matk = hero.class.matk;
        hero.def = hero.class.def;
        hero.mdef = hero.class.mdef;
        hero.speed = hero.class.speed;
        hero.action = "";
      });
      if (user.id == $scope.user.id) {
        $scope.ally1 = {name : team[0].class.name, id: team[0].id};
        $scope.ally2 = {name : team[1].class.name, id: team[1].id};
        $scope.ally3 = {name : team[2].class.name, id: team[2].id};
      } else {
        $scope.enemy1 = {name : team[0].class.name, id: team[0].id};
        $scope.enemy2 = {name : team[1].class.name, id: team[1].id};
        $scope.enemy3 = {name : team[2].class.name, id: team[2].id};
      }
  };


  $scope.setHPBar = function(hero){
      let hp = hero.class.health;
      return { width : (100 * hero.hp) / hp };
  };

  $scope.setMPBar = function(hero){
      let mp = hero.class.mana;
      return { width : (100 * hero.mp) / mp };
  };

  $scope.checkStatChange = function(hero, stat){
    let result;
    if (hero[stat] > hero.class[stat]){
      result = {color: 'hsl(141, 71%,  48%)'}
    } else if (hero.stat < hero.class[stat]){
      result = {color: 'hsl(348, 100%, 61%)'}
    };
    return result;
  };

  $scope.isTurnInvalid = function(){
    let result;
    function hasAction(hero){
      return hero.action.length == 0;
    };

    function needsTarget(hero){
      return ( (hero.action == 'skill' &&
                hero.skillAction.target == 'single' &&
                hero.target == null) ||
               (hero.action == 'attack' &&
                hero.target == null));
    };

    function needsSkill(hero){
      return (hero.action == 'skill' && hero.skillAction.id == undefined)
    };

    return ($scope.userTeam.some(hasAction) ||
            $scope.userTeam.some(needsTarget) ||
            $scope.userTeam.some(needsSkill));
  }

  $scope.setAction = function(hero, command){
    hero.action = command;
  };

  function setDefaultTurn(){
    $scope.userTeam.forEach(function(hero, index){
      hero.action = 'wait';
      $scope.confirmTurn()
    })
  }

  $scope.confirmTurn = function(){
    if ($scope.turnConfirmed == false){
      $interval.cancel($scope.countdown);
      $scope.countdown = undefined;
      socket.emit('confirmTurn', $rootScope.gameData.room);
      $scope.turnConfirmed = true;
    }else{
      console.log('turn confirmed already !');
    }

  };

  socket.on('waitingForOpp', function(){
    $scope.waitingForOpp = true;
  });

  socket.on('rdyToResolve', function(){
    $scope.waitingForOpp = false;
    let data = angular.toJson({turnData : $scope.userTeam, room : $rootScope.gameData.room}, true);
    socket.emit('resolveTurn', data);
  });

  socket.on('actionResolved', function(response){
    response.combatLog.forEach(function(log, index){
      $scope.combatLog.push(log);
    });
    $scope.roster = response.heroes;
    let userTeam = [],
        oppTeam = [];

    $scope.roster.forEach(function(hero, index){
      if (hero.user_id == $scope.user.id){
        userTeam.push(hero);
      } else {
        oppTeam.push(hero)
      }
    })
    $scope.userTeam = userTeam;
    $scope.oppTeam = oppTeam;
  });

  socket.on('endTurn', function(data){
    $scope.roster = data.heroes;

    let userTeam = [],
        oppTeam = [];

    $scope.roster.forEach(function(hero, index){
      hero.action = "";
      if (hero.user_id == $scope.user.id){
        userTeam.push(hero);
      } else {
        oppTeam.push(hero)
      }
    })
    $scope.userTeam = userTeam;
    $scope.oppTeam = oppTeam;

    data.combatLog.forEach(function(log, index){
      $scope.combatLog.push(log)
    });

    $scope.turnConfirmed = false;
    $scope.timerWarning = false;
    $scope.waitingForOpp = false;
    $scope.timer = 60;
    $scope.setCountdown();

  });

  socket.on('gameWon', function(message){
    console.log(message);
    $scope.gameover = true;
    $scope.message = "VICTORY";
    $scope.gameResult = true;
  });

  socket.on('gameLost', function(message){
    console.log(message);
    $scope.gameover = true;
    $scope.message = "DEFEAT"
    $scope.gameResult = false;
  });


});
