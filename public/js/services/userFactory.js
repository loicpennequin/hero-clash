app.factory('userFactory', function($http, $q){
  return{
    getUSers : function(){
      let deferred = $q.defer();
      $http.get('http://localhost:8080/api/users')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    getUser : function(id){
      let deferred = $q.defer();
      $http.get('http://localhost:8080/api/users/' + id)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    addUser : function(data){
      let deferred = $q.defer();
      $http.post('http://localhost:8080/api/users', data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    signIn : function(data){
      let deferred = $q.defer();
      $http.post('http://localhost:8080/api/signin', data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    signOff : function(){
      let deferred = $q.defer();
      $http.get('http://localhost:8080/api/signoff')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    isLoggedIn : function(){
      let deferred = $q.defer();
      $http.get('http://localhost:8080/api/loggedin')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
