'use strict';

angular.module('chatApp')
  .factory('Block', function ($http) {
    // Service logic
    // ...
    // Public API here
    return {
      getBlockStatus: function (sourceUserId, targetUserId) {
        return $http.get('/api/blocks/' + sourceUserId + '/' + targetUserId);
      },

      updateBlockStatus: function (sourceUserId, targetUserId, block) {
        return $http.patch('/api/blocks/' + sourceUserId + '/' + targetUserId, {block: block});
      }
    };
  })

  .factory('Gcm', function ($http) {
    // Service logic
    // ...
    // Public API here
    return {
      getGcmIds: function (userId) {
        return $http.get('/api/gcms/' + userId);
      }
    };
  })

  .factory('Match', function ($http) {
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
  })

  .factory('Message', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getMessagesFromRoom: function (roomId) {
        return $http.get('/api/messages/' + roomId);
      },

      createMessage: function(roomId, userId, message) {
        return $http.post('/api/messages/', {user_id: userId, message: message, session_id: roomId});
      }
    };
  })

  .factory('Notification', function ($http) {
    // Service logic
    // ...
    // Public API here
    return {
      getNotificationNum: function (fromUserId, toUserId) {
        return $http.get('/api/notifications/' + fromUserId + '/' + toUserId);
      },

      updateNotificationNum: function(fromUserId, toUserId, notiNum) {
        return $http.patch('/api/notifications/' + fromUserId + '/' + toUserId, {noti_num: notiNum});
      }
    };
  })

  .factory('User', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getUser: function(id) {
        return $http.get('/api/users/' + id);
      }
    };
  });