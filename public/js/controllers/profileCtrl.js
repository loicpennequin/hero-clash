app.controller('profileCtrl', function($scope, userFactory){
  $scope.user={};

  userFactory.isLoggedIn()
    .then(function(response){
      userFactory.getUser(response.data.user.id)
        .then(function(response){
          $scope.user = response.data
        }, function(error){
          console.log(error);
        })
    }, function(error){
      console.log(error);
    });
});
