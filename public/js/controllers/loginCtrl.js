app.controller('loginCtrl', function($scope, userFactory, $location, socket){
  $scope.signInError = false;
  $scope.signUpError = false;
  $scope.ErrorMessage = "";

  $scope.loggedIn = false;
  $scope.user = {};
  $scope.newUSer = {};

  userFactory.loginCheck().then(function(response){
    if (response.data.user){
      $scope.loggedIn = true;
      $scope.user = response.data.user;
      if ( $location.path() == "/login"){
        $location.path('/')
      }
    };
  });

  $scope.signUp = function(){
    if ($scope.newUser.password != $scope.newUser.passwordConfirm){
      $scope.signInError = true;
      $scope.errorMessage = "your passwords don't match";
    } else {
      userFactory.addUser($scope.newUser)
        .then(function(response){
          $scope.signInError = true;
          $scope.errorMessage = "signup success";
          $scope.newUser = {};
          $scope.signUpForm.$setPristine();
          $scope.signUpForm.$setUntouched();
        }, function(error){
          $scope.signInError = true;
          $scope.errorMessage = error;
        });
    };
  };

  $scope.signIn = function(){
    userFactory.signIn(this.user)
      .then(function(response){
        if(response.data.message){
          $scope.signUpError = true;
          $scope.errorMessage = response.data.message;
        }else{
          $scope.loggedIn = true;
          $scope.user = response.data;
          $scope.signUpError = true;
          $location.path('/')
      };
      }, function(error){
        console.log(error.data.message);
      });
  };

  $scope.signOff = function(){
    userFactory.signOff()
      .then(function(response){
        $scope.user={};
        $location.path('/login')
        $scope.loggedIn = false;
      }, function(error){
        console.log(error);
      })
  };
});
