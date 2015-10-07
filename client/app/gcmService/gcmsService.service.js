'use strict';

angular.module('chatApp')
  .factory('gcmsService', function ($http) {
    // Service logic
    // ...
    // Public API here
    return {
      getGcmIds: function (userId) {
        return $http.get('/api/gcms/' + userId);
      },
    };
  });
