'use strict';

angular.module('chatApp')
  .factory('defaultRoomsService', function ($http) {
    // Service logic
    // ...

    // Public API here
    return {
      getDefaultRoom: function(userId) {
        return $http.get('/api/default_rooms/' + userId);
      },

      updateOrCreateDefaultRoom: function (userId, roomId) {
        $http.get('/api/default_rooms/' + userId)
          .success(function() {
            $http.patch('/api/default_rooms/' + userId, {room_id: roomId});
          })
          .error(function() {
            $http.post('/api/default_rooms', {user_id: userId, room_id: roomId});
          })
      }
    };
  });
