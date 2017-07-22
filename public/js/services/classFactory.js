app.factory('classFactory', function($http, $q){
  return{
    getClasses : function(){
      let deferred = $q.defer();
      $http.get('http://localhost:8080/api/classes')
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
