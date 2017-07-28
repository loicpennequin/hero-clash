app.factory('userFactory', function($http, $q){
  return{
    getUsers : function(){
      let deferred = $q.defer();
      $http.get('/api/users')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    getUser : function(id){
      let deferred = $q.defer();
      $http.get('/api/users/' + id)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    addUser : function(data){
      let deferred = $q.defer();
      $http.post('/api/users', data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    signIn : function(data){
      let deferred = $q.defer();
      $http.post('/api/signin', data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    signOff : function(){
      let deferred = $q.defer();
      $http.get('/api/signoff')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    loginCheck : function(){
      let deferred = $q.defer();
      $http.get('/api/loggedin')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
