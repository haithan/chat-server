'use strict';

angular.module('chatApp')
  .controller('MainCtrl', function ($scope, socket, $rootScope, chatUtils, chatFilters, $stateParams,
                                    Notification, Message, User, Gcm, Match, $timeout, Crypto) {
    if($stateParams.roomId == '' || $stateParams.userId == '') {
      return;
    }
    var userId = $rootScope.userId;
    var targetUserId = $stateParams.userId;
    var targetUserName = $rootScope.targetUserName;
    var sessionId = $stateParams.roomId;
    var targetAvatarUrl = $rootScope.targetAvatarUrl;
    var targetUserGgIds = '';
    $scope.emojiPopup = false;
    $scope.isBlocked = false;
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

    // init when join room
    Match.checkRoomPermission(userId, targetUserId, sessionId)
      .then(function(res) {
        if (res.status === 200) {
          socket.emit('addUser', {room: sessionId, userId: userId});
          $timeout(function(){
            $('#'+ $stateParams.userId).addClass('active');
          },500);
        } else {
          return;
        }
      })

    Gcm.getGcmIds(targetUserId).success(function(data) {
      targetUserGgIds = data.gcm_ids;
    })

    Notification.updateNotificationNum(targetUserId, userId, 0);
    // end of init

    var prepareChat = function(data) {
      var chat = {};

      chat._id = data._id;
      chat.float_class = 'pull-right';
      chat.message = data.message;

      var url = chatUtils.getUrlFromText(data.message);
      if (url) {
        chatUtils.isImage(url).then(function(result) {
          if (result === true) {
            chat.image_url = url;
          }
        });
      }

      if ( data.user_id != userId ) {
        chat.float_class = '';
        chat.username = targetUserName;
        chat.avatar_url = targetAvatarUrl;
      }

      return chat;
    }

    // append chat to view
    var appendChat = function(data, isLastMsg) {
      if (!data.message) { return; }

      $scope.isBlocked = false;

      isLastMsg = typeof isLastMsg !== 'undefined' ? isLastMsg : true;

      // decrypt message in case it is the message broadcast from socket
      if (isLastMsg) { data.message = Crypto.decrypt(data.message); }
      var chat = prepareChat(data);

      if (isLastMsg) {
        $scope.chats.push(chat);
      } else {
        $scope.chats.unshift(chat);
      }
    };

    var updateNotification = function(data) {
      if (data && data.from_user_id && data.to_user_id && data.noti_num && data.to_user_id == userId) {
        var $userRow = $('#' + data.from_user_id);
        // if user is currently in this room then return
        if ( $userRow.hasClass('active') ) {
          Notification.updateNotificationNum(targetUserId, userId, 0);
          return;
        }
      }
    };

    var getMessage = function() {
      $scope.chats = [];
      var id = typeof $scope.chats[0] !== 'undefined' ? $scope.chats[0]._id : 'undefined';

      Message.getMessagesFromRoom(sessionId, id).success(function(data) {
        if (data === undefined || data.length == 0) {
          return;
        }

        data.forEach(function(d) {
          appendChat(d, false);
        });
      });
    };

    var showBlockStatus = function(data) {
      if (!data.targetUserId || data.targetUserId !== targetUserId) { return; }

      $scope.isBlocked = true;

      var chatContent = angular.element(document.getElementById('chatContent'));
      $timeout(function() {
        chatContent.scrollTop(chatContent[0].scrollHeight);
      }, 100)
    }

    $scope.sendChat = function() {
      if($scope.chatMessage === '') {
        return;
      }

      // filter bad words
      var message = chatFilters.filterBadWords($scope.chatMessage);
      message = Crypto.encrypt(message);
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

    $scope.showEmojiPopup = function($event) {
      $scope.emojiPopup = $scope.emojiPopup === false ? true : false
    };

    $scope.appendEmojiToMessage = function(icon) {
      var message = $scope.chatMessage === undefined ? '' : $scope.chatMessage;
      $scope.chatMessage = message + ":" + icon + ":";
    };

    $scope.loadMore = function() {
      var id = typeof $scope.chats[0] !== 'undefined' ? $scope.chats[0]._id : 'undefined';
      Message.getMessagesFromRoom(sessionId, id).success(function(datas) {
        if (datas === undefined || datas.length == 0) {
          return;
        }

        datas.forEach(function(data) {
          appendChat(data, false);
        });
      })
    }

    socket.on('notification:save', updateNotification);
    socket.on('getMessage', getMessage);
    socket.on('updateChat', appendChat);
    socket.on('user:isBlocked', showBlockStatus);

    $scope.$on('$destroy', function() {
      socket.removeListener('getMessage', getMessage);
      socket.removeListener('updateChat', appendChat);
      socket.removeListener('notification:save', updateNotification);
      socket.emit('user:leaveRoom');
    });

  });
