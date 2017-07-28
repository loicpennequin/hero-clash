app.factory('skillFactory', function($http, $q){
  return{
    buy : function(skill, hero){
      let deferred = $q.defer();
      $http.get('/api/skills/buy', {
        params: {
          skill: skill,
          hero: hero
        }
      })
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
