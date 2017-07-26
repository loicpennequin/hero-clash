app.factory('battleFactory', function($http, $q){
  return{
    setGameState : function(data){
    let deferred = $q.defer();
    $http.post('http://localhost:8080/api/gamestate', data)
      .then(function(response){
        deferred.resolve(response.data)
      }, function(error){
        deferred.reject(error)
      });
    return deferred.promise;
    },
    getGameState : function(){
      let deferred = $q.defer();
      $http.get('http://localhost:8080/api/gamestate')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
