'use strict';

angular.module('chatApp')
  .factory('matchsService', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getMatchs: function (userId) {
        return $http.get('/api/matchs/' + userId);
      },

      checkRoomPermission: function (roomId, userId) {
        return $http.get('/api/matchs/' + roomId + '/' + userId);
      }
    };
  });
