app.factory('battleFactory', function($http, $q){
  return{
    setGameState : function(data, type){
    let deferred = $q.defer();
    $http.post('/api/gamestate/' + type , data)
      .then(function(response){
        deferred.resolve(response.data)
      }, function(error){
        deferred.reject(error)
      });
    return deferred.promise;
    },
    getGameState : function(type){
      let deferred = $q.defer();
      $http.get('/api/gamestate/' + type)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
