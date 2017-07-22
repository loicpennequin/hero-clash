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
          let index1 = $scope.user.heroes.findIndex(item => item.id === $scope.user.team_slot1),
              index2 = $scope.user.heroes.findIndex(item => item.id === $scope.user.team_slot2),
              index3 = $scope.user.heroes.findIndex(item => item.id === $scope.user.team_slot3);
          $scope.user.teamHero1 = $scope.user.heroes[index1]
          $scope.user.teamHero2 = $scope.user.heroes[index2]
          $scope.user.teamHero3 = $scope.user.heroes[index3]
        }, function(error){
          console.log(error);
        })
    };

    $scope.isOwnedSkill = function(skill, hero){
      function isOwned(el, key, table){
        return skill.id == el.id;
      }
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
        })
    }

    $scope.setTeamMember = function(hero, slot){
      let picker = "teamPicker" + slot;
      $scope[picker] = false;
      heroFactory.setTeamMember(hero, slot)
        .then(function(response){
          $scope.getUser($scope.user.id);
        }, function(error){
          console.log(error);
        })
    }
});
