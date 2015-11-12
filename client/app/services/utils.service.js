'use strict';

angular.module('chatApp')
  .factory('chatUtils', function ($stateParams, $rootScope, $q) {
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
        return _.findIndex(users, function(user) {return user.id == id});
      }

    };
  })

  .factory('chatFilters', function () {
    // Service logic
    // ...

    var filterWords = ["địt", "việt cộng", "lồn", "cặc", "buồi"];
    var rgx = new RegExp(filterWords.join("|"), "gi");
    // Public API here
    return {
      filterBadWords: function (str) {
        return str.replace(rgx, "***");
      }
    };
  })

  .factory('Mobile', ['$window', function ($window) {
    var md = new MobileDetect($window.navigator.userAgent);

    return {
      detect: function() {
        if (md.mobile() != null) {
          return true;
        }

        return false;
      }
    };
  }])

  .factory('Crypto', function () {
    var pass = 'mmj@#172014';

    return {
      encrypt: function(text) {
        var enc = CryptoJS.AES.encrypt(text, pass).toString();

        return enc;
      },

      decrypt: function(text) {
        var dec = CryptoJS.AES.decrypt(text, pass);
        dec = dec.toString(CryptoJS.enc.Utf8);

        return dec;
      }
    };
  });

