app.controller('profileCtrl', function($scope, userFactory, skillFactory, heroFactory){
  $scope.user={};
  $scope.teamPicker1 = false;
  $scope.teamPicker2 = false;
  $scope.teamPicker3 = false;

  userFactory.loginCheck()
    .then(function(response){
      $scope.getUser(response.data.user.id)
    }, function(error){
      console.log(error);
    });

    $scope.getUser = function(id){
      userFactory.getUser(id)
        .then(function(response){
          $scope.user = response.data
          let heroes = $scope.user.heroes,
              member1 = heroes.findIndex(item => item.id === $scope.user.team_slot1),
              member2 = heroes.findIndex(item => item.id === $scope.user.team_slot2),
              member3 = heroes.findIndex(item => item.id === $scope.user.team_slot3);
          $scope.user.teamHero1 = $scope.user.heroes[member1];
          $scope.user.teamHero2 = $scope.user.heroes[member2];
          $scope.user.teamHero3 = $scope.user.heroes[member3];
          heroes.forEach(function(hero, index){
            skill1 = hero.skills.findIndex(item => item.id === hero.skill1),
            skill2 = hero.skills.findIndex(item => item.id === hero.skill2),
            skill3 = hero.skills.findIndex(item => item.id === hero.skill3),
            skill4 = hero.skills.findIndex(item => item.id === hero.skill4);
            hero.activeSkill1 = hero.skills[skill1];
            hero.activeSkill2 = hero.skills[skill2];
            hero.activeSkill3 = hero.skills[skill3];
            hero.activeSkill4 = hero.skills[skill4];
          })
        }, function(error){
          console.log(error);
        });
    };

    $scope.isOwnedSkill = function(skill, hero){
      function isOwned(el, key, table){
        return skill.id == el.id;
      };
      return hero.skills.some(isOwned)
    };

    $scope.buySkill = function(skill, hero){
      skillFactory.buy(skill.id, hero.id)
        .then(function(response){
          if(response.data.message === "Sorry, not enough diamonds"){
            alert(response.data.message)
          }else {
            $scope.getUser($scope.user.id);
          }
        },function(error){
          console.log(error);
        });
    };

    $scope.setTeamMember = function(hero, slot){
      let picker = "teamPicker" + slot;
      $scope[picker] = false;
      heroFactory.setTeamMember(hero, slot)
        .then(function(response){
          $scope.getUser($scope.user.id);
        }, function(error){
          console.log(error);
        });
    };

    $scope.setActiveSkill = function(hero, skill, slot){
      console.log(slot);
      let data = {};
      data.hero = hero.id,
      data.skill = skill.id;
      heroFactory.setActiveSkill(data, slot)
        .then(function(response){
          $scope.getUser($scope.user.id)
        }, function(error){
          console.log(error);
        });
    };
});
