'use strict';

angular.module('chatApp')
  .factory('chatUtils', function ($q) {
    // Service logic
    // ...

    // Public API here
    return {
      isImage: function(src) {
        var deferred = $q.defer();
        var image = new Image();
        image.onerror = function() {
            deferred.resolve(false);
        };
        image.onload = function() {
            deferred.resolve(true);
        };
        image.src = src;

        return deferred.promise;
      },

      getUrlFromText: function(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var url = text.match(/(https?:\/\/[^\s]+)/g);
        if (url) {
          return url[0];
        }
      },

      findIndexByUserId: function(id, users) {
        return _.findIndex(users, function(user) {return user.user_id == id});
      }
    };
  });
