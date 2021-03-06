app.factory('heroFactory', function($http, $q){
  return{
    setTeamMember : function(data, slot){
      let deferred = $q.defer();
      $http.put('/api/heroes/team/' + slot, data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    setActiveSkill : function(data, slot){
      let deferred = $q.defer();
      $http.put('/api/heroes/activeskill/' + slot, data)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    },
    getHeroesFromUser : function(id){
      let deferred = $q.defer();
      $http.get('/api/heroes/user/' + id)
        .then(function(response){
          deferred.resolve(response.data)
        }, function(error){
          deferred.reject(error)
        });
      return deferred.promise;
    }
  }
});
