app.controller('profileCtrl', function($scope, userFactory, skillFactory){
  $scope.user={};

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
});
