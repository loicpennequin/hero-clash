app.controller('trainingCtrl', function($scope, $q, classFactory, userFactory, skillFactory, heroFactory, battleFactory, socket){
  $scope.user = {};
  $scope.roster = [];
  $scope.userTeam = [];
  $scope.oppTeam = [];
  $scope.combatLog = [];

  userFactory.loginCheck()
    .then(function(response){
      Init(response.data.user.id);
    }, function(error){
      console.log(error);
    });

    $scope.getUser = function(id){
      userFactory.getUser(id)
        .then(function(response){
          $scope.user = response.data;
        }, function(error){
          console.log(error);
        });
    };

  function Init(id){
    userFactory.getUser(id)
      .then(function(response){
        $scope.user = response.data;
        setMembersAndSkills();
        setTeams();
      }, function(error){
        console.log(error);
      });
  }

  function setMembersAndSkills(){
    let heroes = $scope.user.heroes,
        members = {},
        deferred = $q.defer();
    heroes.forEach(function(hero, index){
      for(let i = 1; i <=4 ; i++){
        let s = hero.skills.findIndex(item => item.id === hero['skill' + i]);
        hero['activeSkill' +i] = hero.skills[s];
      }
      hero.target = {};
      hero.skillAction = {};
    });
    for(let i = 1; i <=3 ; i++){
      members[i] = heroes.findIndex(item => item.id === $scope.user['team_slot' + i]);
      $scope.user['teamHero' + i] = $scope.user.heroes[members[i]];
    }
  }

  function setTeams(){
      $scope.userTeam.push($scope.user.teamHero1, $scope.user.teamHero2, $scope.user.teamHero3);
      $scope.userTeam.forEach(function(hero, index){
        hero.hp = hero.class.health;
        hero.mp = hero.class.mana;
        hero.atk = hero.class.atk;
        hero.matk = hero.class.matk;
        hero.def = hero.class.def;
        hero.mdef = hero.class.mdef;
        hero.speed = hero.class.speed;
        hero.action = {};
      })
      heroFactory.getHeroesFromUser(0)
        .then(function(response){
          for (var i = 1; i <= 3; i++) {
            let dummy = response.data[i-1];
            dummy.hp = dummy.class.health;
            dummy.hp = dummy.class.health;
            dummy.mp = dummy.class.mana;
            dummy.atk = dummy.class.atk;
            dummy.matk = dummy.class.matk;
            dummy.def = dummy.class.def;
            dummy.mdef = dummy.class.mdef;
            dummy.speed = dummy.class.speed;
            dummy.action = {};
            dummy.class.name = 'dummy' + i;
            $scope.oppTeam.push(dummy)
          };
          $scope.roster = $scope.userTeam.concat($scope.oppTeam);
        }, function(error){
          console.log(error);
        })
  };

  $scope.setHPBar = function(hero){
      let hp = hero.class.health;
      return { width : (100 * hero.hp) / hp };
  };

  $scope.setMPBar = function(hero){
      let mp = hero.class.mana;
      return { width : (100 * hero.mp) / mp };
  };

  $scope.setAction = function(button, hero, command, skill = 0){
    hero.action = command;
  };

  $scope.resolveTurn = function(){
    //set dummies actions;
    $scope.oppTeam.forEach(function(dummy, index){
      dummy.action = 'wait';
    });

    //Setup roster;
    $scope.roster = $scope.userTeam.concat($scope.oppTeam);

    //sort array by speed then put defending heroes first;
    sortHeroes($scope.roster);
    resolveAction(0);

    function sortHeroes(arr){
      arr.sort(function(a,b) {
        return b.speed - a.speed
      });
      arrCopy = arr.slice(0);
      arrCopy.forEach(function(hero, index){
        if(hero.action == 'defend'){
          let oldIndex = arrCopy.indexOf(hero),
              newIndex = 0;
          arr.splice(oldIndex, 1);
          arr.splice(newIndex, 0, hero);
        };
      });
    };

    //this function resolve an action, starting from the fastest hero's action, then indescending order.
    function resolveAction(index){
      //sends the message to the server
      socket.emit('action', {actor : $scope.roster[index], heroes : $scope.roster}, (response) =>{
        //updates combat log
        response.combatLog.forEach(function(log, index){
          $scope.combatLog.push(log);
        })

        //updates roster
        $scope.roster = response.heroes;

        //does resolveAction again unless all heroes have already acted, in which case end turn.
        index++;
        if (index < $scope.roster.length){
          resolveAction(index);
        }else{
          socket.emit('endTurn', {heroes : $scope.roster}, (response) =>{
            $scope.roster = response.heroes;
            $scope.userTeam = response.userTeam;
            $scope.oppTeam = response.oppTeam;
            response.combatLog.forEach(function(log, index){
              $scope.combatLog.push(log)
            });
          });
        };
      });
    };
  };


});
