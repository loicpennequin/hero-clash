app.factory('heroFactory', function($http, $q){
  return{
    setTeamMember : function(data, slot){
      let deferred = $q.defer();
      $http.put('http://localhost:8080/api/heroes/team/' + slot, data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    setActiveSkill : function(data, slot){
      let deferred = $q.defer();
      $http.put('http://localhost:8080/api/heroes/activeskill/' + slot, data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
