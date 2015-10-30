'use strict';

angular.module('chatApp')
  .controller('MainCtrl', function ($scope, socket, $rootScope, chatUtils, chatFilters, $stateParams,
                                    Notification, Message, User, Gcm) {
    if($stateParams.roomId == '' || $stateParams.userId == '') {
      return;
    }

    var userId = $rootScope.userId;
    var targetUserId = $stateParams.userId;
    var targetUserName = '';
    var sessionId = $stateParams.roomId;
    var targetAvatarUrl = '';
    var messageTo = '';
    var targetUserGgIds = '';
    $scope.emojiPopup = false;
    $scope.emojis = ['bowtie', 'smile', 'laughing', 'blush', 'smiley', 'relaxed',
            'smirk', 'heart_eyes', 'kissing_heart', 'kissing_closed_eyes', 'flushed',
            'relieved', 'satisfied', 'grin', 'wink', 'stuck_out_tongue_winking_eye',
            'stuck_out_tongue_closed_eyes', 'grinning', 'kissing', 'winky_face',
            'kissing_smiling_eyes', 'stuck_out_tongue', 'sleeping', 'worried',
            'frowning', 'anguished', 'open_mouth', 'grimacing', 'confused', 'hushed',
            'expressionless', 'unamused', 'sweat_smile', 'sweat', 'wow',
            'disappointed_relieved', 'weary', 'pensive', 'disappointed', 'confounded',
            'fearful', 'cold_sweat', 'persevere', 'cry', 'sob', 'joy', 'astonished',
            'scream', 'neckbeard', 'tired_face', 'angry', 'rage', 'triumph', 'sleepy'];

    // init some target variables
    User.getUser(targetUserId).success(function(data) {
      targetUserName = data.user_name;
      targetAvatarUrl = data.avatar_url;
      socket.emit('addUser', {room: sessionId, userId: userId});
    });

    Gcm.getGcmIds(targetUserId).success(function(data) {
      targetUserGgIds = data.gcm_ids;
    })

    // delete all notification of this room when joined
    Notification.updateNotificationNum(targetUserId, userId, 0);

    // get all old messages after join room
    socket.on('getMessage', function() {
      $scope.chats = [];

      Message.getMessagesFromRoom(sessionId).success(function(data) {
        if (data === undefined || data.length == 0) {
          return;
        }

        data.forEach(function(d) {
          appendChat(d);
        });
      });
    });

    // send chat function is fired when hit Enter or click sendChat button
    $scope.sendChat = function() {
      if($scope.chatMessage === '') {
        return;
      }

      // filter bad words
      var message = chatFilters.filterBadWords($scope.chatMessage);
      // erase chat message when sent
      $scope.chatMessage = '';

      socket.emit('sendChat', {message: message, targetUserGgIds: targetUserGgIds, targetUserId: targetUserId});
    };

     // handle case use shift+enter to break line chat
    $scope.sendChatByKey = function($event) {
      if ($event.shiftKey) {
        return;
      } else {
        $event.preventDefault();
        $scope.sendChat();
      }
    };

    socket.on('updateChat', function(data) {
      appendChat(data);
    });

    // append chat to view
    var appendChat = function(data) {
      var chat = {};
      chat.float_class = 'pull-right';
      var $chatContent = $('#chatContent');
      if (data.message) {
        chat.message = data.message;

        // get image link from text message
        var url = chatUtils.getUrlFromText(data.message);
        if (url) {
          chatUtils.isImage(url).then(function(result) {
            if (result === true) {
              chat.image_url = url;
            }
          });
        }
      }

      if ( data.user_id != userId ) {
        chat.float_class = '';
        chat.username = targetUserName;
        chat.avatar_url = targetAvatarUrl;
      }

      $scope.chats.push(chat);
    };

    socket.on('notification:save', function(data) {
      if (data && data.from_user_id && data.to_user_id && data.noti_num && data.to_user_id == userId) {
        var $userRow = $('#' + data.from_user_id);
        // if user is currently in this room then return
        if ( $userRow.hasClass('active') ) {
          Notification.updateNotificationNum(targetUserId, userId, 0);
          return;
        }
      }
    });

    $scope.showEmojiPopup = function($event) {
      $scope.emojiPopup = $scope.emojiPopup === false ? true : false
    };

    $scope.appendEmojiToMessage = function(icon) {
      var message = $scope.chatMessage === undefined ? '' : $scope.chatMessage;
      $scope.chatMessage = message + ":" + icon + ":";
    };

  });
