'use strict';

angular.module('chatApp')
  .controller('MainCtrl', function ($scope, $http, socket, $location, $rootScope,
                                    $cookieStore, chatUtils, chatFilters, authService,
                                    matchsService, defaultRoomsService, notificationsService,
                                    blocksService, messagesService, $window, userService, gcmsService) {
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

    // update or create new record that hold default room id, that info will be use in notification function
    socket.on('updateDefaultRoomId', function(data) {
      defaultRoomsService.updateOrCreateDefaultRoom(userId, data.room_id);
    });

    // call join room when click user in user list
    $scope.joinRoom = function($event, user) {
      // add class active for user row, refresh text of chat content
      $('.user-row').removeClass('active');
      $($event.currentTarget).addClass('active');

      targetUserId = '';
      currentUserName = '';
      targetUserName = '';
      sessionId = '';
      targetAvatarUrl = '';
      messageTo = '';
      targetUserGgIds = '';

      // check if current user can access this room or not
      // matchsService.checkRoomPermission(user.session_id, userId)
      //   .success(function(data) {
      //     if (data.status === undefined || data.status == 'bad_request') {
      //       raiseBadRequestError();
      //       return;
      //     }

      //     joinRoom(user);
      //   })

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

      // check if current user is blocked by target user or not
      blocksService.getBlockStatus(targetUserId, userId)
        .success(function(data) {
          if (data.block === true) {
            return;
          }

          sendChat(message);
        })
        .error(function() {
          sendChat(message);
        });
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

    var sendChat = function(message) {
      messageTo = message;
      async.series([
        saveNotification,
        getDefaultRoomOfTargetUser
        ], function(err, results) {
        });

      // save message into DB
      messagesService.createMessage(sessionId, userId, message);
    };

    var saveNotification = function(callback) {
      notificationsService.getNotificationNum(userId, targetUserId)
        .success(function(data) {
          var notiNum = data.noti_num + 1;
          notificationsService.updateNotificationNum(userId, targetUserId, notiNum);
          callback(null);
        })
        .error(function(data) {
          notificationsService.createNotification(userId, targetUserId);
          callback(null);
        });
    };

    var getDefaultRoomOfTargetUser = function(callback) {
      defaultRoomsService.getDefaultRoom(targetUserId)
        .success(function(data) {
          socket.emit('sendChat', {message: messageTo, target_default_room: data.room_id, targetUserGgIds: targetUserGgIds});
          callback(null);
        })
        .error(function() {
          socket.emit('sendChat', {message: messageTo, targetUserGgIds: targetUserGgIds});
          callback(null);
        });
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
    socket.on('notifyChat', function(data) {
      var $userRow = $('#' + data.user_id);
      // if user is currently in this room then return
      if ( $userRow.hasClass('active') ) {
        deleteNotifications();
        return;
      }

      notificationsService.getNotificationNum(data.user_id, userId)
        .success(function(response) {
          updateNotification(response.noti_num, data.user_id);
        });
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
