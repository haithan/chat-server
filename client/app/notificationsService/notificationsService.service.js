'use strict';

angular.module('chatApp')
  .factory('notificationsService', function ($http) {
    // Service logic
    // ...
    // Public API here
    return {
      getNotificationNum: function (fromUserId, toUserId) {
        return $http.get('/api/notifications/' + fromUserId + '/' + toUserId);
      },

      updateNotificationNum: function(fromUserId, toUserId, notiNum) {
        return $http.patch('/api/notifications/' + fromUserId + '/' + toUserId, {noti_num: notiNum});
      },

      createNotification: function(fromUserId, toUserId) {
        return $http.post('/api/notifications/', {from_user_id: fromUserId, to_user_id: toUserId, noti_num: 1});
      }
    };
  });
