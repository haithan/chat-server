'use strict';

angular.module('chatApp')
  .controller('MainCtrl', function ($scope, $http, socket, $location, $rootScope,
                                    $cookieStore, chatUtils, chatFilters, authService,
                                    matchsService, notificationsService,
                                    blocksService, messagesService, $window, userService, gcmsService, $timeout) {
    var userId = '';
    var targetUserId = '';
    var currentUserName = '';
    var targetUserName = '';
    var sessionId = '';
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

    // authentication when connect to chat app
    socket.on('connect', function () {
      authService.auth()
        .success(function(data) {
          authenticate(data);
        })
        .error(function() {
          alert('Có lỗi kết nối. Vui lòng liên hệ admin để kiểm tra. Xin cám ơn.');
          $window.location.href = 'http://ymeet.me';
        })
    });

    var authenticate = function(data) {
      if (data.user_id === false) {
        alert('Bạn chưa đăng ký dịch vụ ymeet.me . Vui lòng đăng ký trước khi sử dụng dịch vụ chat. Xin cám ơn.');
        $window.location.href = 'http://ymeet.me';
        return;
      }

      userId = data.user_id;

      matchsService.getMatchs(userId).success(function(data) {
        initMatchUsers(data);
      });
    };

    var initMatchUsers = function(datas) {
      var users = [];
      angular.forEach(datas, function(data) {
        var user = {};
        user.user_id = data.target_id;
        user.session_id = data.session_id;
        users.push(user);
      });

      async.each(users, initUser, function(err) {
        $scope.users = users;

        // auto join first room when open page
        $scope.joinRoom(users[0])
      });

      socket.emit('takeCurrentRoomId');
    };

    var initUser = function(user, callback) {
      async.waterfall([
        function(cb) {
          userService.getUser(user.user_id).success(function(data) {
            user.user_name = data.name;
            user.avatar_url = data.avatar_url;
            cb(null, user);
          })
        },
        function(user, cb) {
          user.noti_num = 0;
          notificationsService.getNotificationNum(user.user_id, userId)
            .success(function(data) {
              user.noti_num = data.noti_num;
              cb(null, user);
            })
            .error(function(error) {
              cb(null, user);
            });
        },
        function(user, cb) {
          user.block = false;
          blocksService.getBlockStatus(userId, user.user_id)
            .success(function(data) {
              user.block = data.block;
              cb(null, user);
            })
            .error(function(error) {
              cb(null,user);
            });
        }], function(error, user) {
          callback();
        });
    };

    // call join room when click user in user list
    $scope.joinRoom = function(user, $event) {
      // add class active for user row, refresh text of chat content
      if ( typeof $event !== 'undefined') {
        $('.user-row').removeClass('active');
        $($event.currentTarget).addClass('active');
      } else {
        $timeout(function() {$(".user-row:first").addClass('active');}, 100)
      }

      targetUserId = '';
      currentUserName = '';
      targetUserName = '';
      sessionId = '';
      targetAvatarUrl = '';
      messageTo = '';
      targetUserGgIds = '';

      joinRoom(user);
    };

    var joinRoom = function(user) {
      // init some target variables
      targetUserName = user.user_name;
      targetAvatarUrl = user.avatar_url;
      targetUserId = user.user_id;
      sessionId = user.session_id;
      gcmsService.getGcmIds(targetUserId).success(function(data) {
        targetUserGgIds = data.gcm_ids;
      })

      // delete all notification of this room when joined
      deleteNotifications();

      // add user to chat room
      socket.emit('addUser', {room: sessionId, username: currentUserName, userId: userId});
    };

    // get all old messages after join room
    socket.on('getMessage', function() {
      $scope.chats = [];

      messagesService.getMessagesFromRoom(sessionId).success(function(data) {
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

    // notify chat when not in room
    socket.on('notification:save', function(data) {
      if (data && data.from_user_id && data.to_user_id && data.noti_num && data.to_user_id == userId) {
        var $userRow = $('#' + data.from_user_id);
        // if user is currently in this room then return
        if ( $userRow.hasClass('active') ) {
          deleteNotifications();
          return;
        }

        updateNotification(data.noti_num, data.from_user_id)
      }
    });

    var deleteNotifications = function() {
      var index = chatUtils.findIndexByUserId(targetUserId, $scope.users);
      $scope.users[index].noti_num = 0;
      notificationsService.updateNotificationNum(targetUserId, userId, 0);
    };

    var updateNotification = function(notiNum, userId) {
      var index = chatUtils.findIndexByUserId(userId, $scope.users);
      $scope.users[index].noti_num = notiNum;
    };

    $scope.showEmojiPopup = function($event) {
      $scope.emojiPopup = $scope.emojiPopup === false ? true : false
    };

    $scope.appendEmojiToMessage = function(icon) {
      var message = $scope.chatMessage === undefined ? '' : $scope.chatMessage;
      $scope.chatMessage = message + ":" + icon + ":";
    };

    $scope.blockUser = function($event, id) {
      $event.stopPropagation();
      createOrUpdateBlock(id);
    };

    var createOrUpdateBlock = function(id) {
      var index = chatUtils.findIndexByUserId(id, $scope.users);
      blocksService.getBlockStatus(userId, id)
        .success(function(data) {
          blocksService.updateBlockStatus(userId, id, !data.block);
          $scope.users[index].block = !data.block;
        })
        .error(function(data) {
          blocksService.block(userId, id);
          $scope.users[index].block = true;
        });
    };

    // exception
    var raiseAuthenticationError = function() {
    };

    var raiseBadRequestError = function() {
    };

  });
