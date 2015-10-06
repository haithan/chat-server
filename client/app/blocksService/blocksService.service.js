'use strict';

angular.module('chatApp')
  .factory('blocksService', function ($http) {
    // Service logic
    // ...
    // Public API here
    return {
      getBlockStatus: function (sourceUserId, targetUserId) {
        return $http.get('/api/blocks/' + sourceUserId + '/' + targetUserId);
      },

      updateBlockStatus: function (sourceUserId, targetUserId, block) {
        return $http.patch('/api/blocks/' + sourceUserId + '/' + targetUserId, {block: block});
      },

      block: function (sourceUserId, targetUserId) {
        return $http.post('api/blocks', {source_id: sourceUserId, target_id: targetUserId, block: true});
      }
    };
  });
