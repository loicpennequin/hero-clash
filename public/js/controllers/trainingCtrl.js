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
        hero['activeSkill' +i] = hero.skills[i-1];
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

  $scope.attack = function(hero){
    let damage = hero.class.atk - hero.target.class.def;
    if (damage < 10){
      damage = 10;
    };
    hero.target.hp -= damage;
    $scope.combatLog.push(hero.class.name + ' attacked, dealing ' + damage + ' damage to ' + hero.target.class.name + '.')
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
          console.log('defends');
          let oldIndex = arrCopy.indexOf(hero),
              newIndex = 0;
          arr.splice(oldIndex, 1);
          arr.splice(newIndex, 0, hero);
        };
      });
    };

    function resolveAction(index){
      socket.emit('action', {actor : $scope.roster[index], heroes : $scope.roster}, (response) =>{
        $scope.combatLog.push(response.combatLog);
        $scope.roster = response.heroes;
        index++;
        if (index < $scope.roster.length){
          resolveAction(index);
        }else{
          $scope.userTeam = [];
          $scope.oppTeam = [];
          let rosterCopy = $scope.roster.slice(0);
          rosterCopy.forEach(function(hero, index){
            if (hero.hp <= 0){
                let index = rosterCopy.indexOf(hero);
                $scope.roster.splice(index, 1);
                $scope.combatLog.push(hero.class.name + ' has been defeated!')
            } else {
              hero.skillAction = {};
              hero.target = {};
              if(hero.user_id == $scope.user.id){
                $scope.userTeam.push(hero)
              }else{
                $scope.oppTeam.push(hero)
              };
            };
          });
          $scope.combatLog.push('End of the Turn');
        };
      });
    };
  };


});
