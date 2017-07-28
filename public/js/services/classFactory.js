app.factory('classFactory', function($http, $q){
  return{
    getClasses : function(){
      let deferred = $q.defer();
      $http.get('http://192.168.0.11:8080/api/classes')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    buy : function(data){
      let deferred = $q.defer();
      $http.post('http://192.168.0.11:8080/api/classes/buy', data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
