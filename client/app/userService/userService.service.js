'use strict';

angular.module('chatApp')
  .factory('userService', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getUser: function(id) {
        return $http.get('/api/users/' + id);
      }
    };
  });
