'use strict';

angular.module('chatApp')
  .factory('authService', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      auth: function () {
        return $http.get('/auth');
      }
    };
  });
