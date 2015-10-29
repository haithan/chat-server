'user strict';

angular.module('chatApp')
  .factory('Auth', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      auth: function () {
        return $http.get('/auth');
      }
    };
  });