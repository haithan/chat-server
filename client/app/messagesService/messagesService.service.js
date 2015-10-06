'use strict';

angular.module('chatApp')
  .factory('messagesService', function ($http) {
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
  });
