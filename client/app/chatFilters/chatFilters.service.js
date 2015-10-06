'use strict';

angular.module('chatApp')
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
  });
