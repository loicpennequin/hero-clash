app.controller('shopCtrl', function($scope, userFactory, skillFactory, heroFactory, classFactory){

  $scope.user = {};
  $scope.classes = {};

  userFactory.loginCheck()
    .then(function(response){
      $scope.getUser(response.data.user.id);
      $scope.getClasses();
    }, function(error){
      console.log(error);
    });

    $scope.getClasses = function(){
      classFactory.getClasses()
        .then(function(response){
          $scope.classes = response.data
        }, function(error){
          console.log(error);
        })
    }

    $scope.getUser = function(id){
      userFactory.getUser(id)
        .then(function(response){
          $scope.user = response.data
        }, function(error){
          console.log(error);
        })
    };

    $scope.isOwnedClass = function(job){
      function isOwned(el,key,table){
        return el.class.name == job.name
      }
      let heroes = $scope.user.heroes;
      if (heroes) {
        return heroes.some(isOwned);
      }
    }

    $scope.buyClass=function(job){
      classFactory.buy(job)
        .then(function(response){
          $scope.getUser($scope.user.id);
          $scope.getClasses();
        }, function(error){
          console.log(error);
        })
    }



});
