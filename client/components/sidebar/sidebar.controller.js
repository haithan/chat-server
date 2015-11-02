'use strict';

angular.module('chatApp')
  .controller('SideBarCtrl', function ($scope, User, Match, $rootScope, $location,
                                       Block, Notification, Message, $stateParams,
                                       $timeout, socket, chatUtils) {
    // init user list
    Match.getMatchs($rootScope.userId).success(function(datas) {
      async.waterfall([
        function(cb){
          initMatchInfo(datas, cb);
        },
        function(users, cb){
          initUsers(users, cb);
        },
        function(users, cb){
          setCurrentChatRoom(users, cb);
        }
      ], function (err, result) {
      });
    });

    var initMatchInfo = function(datas, cb) {
      var users = [];
      angular.forEach(datas, function(data) {
        var user = {};
        user.id = data.target_id;
        user.session_id = data.session_id;
        users.push(user);
      });
      cb(null, users);
    };

    var initUsers = function(users, cb) {
      async.each(users, initUser, function(err) {
        $scope.users = users;
        cb(null, users);
      });

    };

    var setCurrentChatRoom = function(users, cb) {
      if($stateParams.roomId == '' || $stateParams.userId == '') {
        // auto join first chat room if no chat room is set
        $location.path('/t/' + $scope.users[0].session_id + '/' + $scope.users[0].id);
      } else {
        $timeout(function() {
          $('#'+ $stateParams.userId).addClass('active');
        }, 100);
      }
      cb(null, users);
    };

    var initUser = function(user, callback) {
      async.waterfall([
        function(cb) {
          initInfo(user, cb);
        },
        function(user, cb) {
          initNotification(user, cb);
        },
        function(user, cb) {
          initBlock(user, cb);
        }], function(error, user) {
          callback();
      });
    };

    var initInfo = function(user, cb) {
      User.getUser(user.id).success(function(data) {
        user.user_name = data.name;
        user.avatar_url = data.avatar_url;
        cb(null, user);
      })
    };

    var initNotification = function(user, cb) {
      user.noti_num = 0;
      Notification.getNotificationNum(user.id, $rootScope.userId)
        .success(function(data) {
          user.noti_num = data.noti_num;
          cb(null, user);
        })
        .error(function(error) {
          cb(null, user);
        });
    };

    var initBlock = function(user, cb) {
      user.block = false;
      Block.getBlockStatus($rootScope.userId, user.id)
        .success(function(data) {
          user.block = data.block;
          cb(null, user);
        })
        .error(function(error) {
          cb(null,user);
        });
    };

    var updateBlockStatus = function(id) {
      var index = chatUtils.findIndexByUserId(id, $scope.users);
      var block = !$scope.users[index].block;

      Block.updateBlockStatus($rootScope.userId, id, block)
        .success(function() {
          $scope.users[index].block = block;
        });
    };

    var updateNotification = function(data) {
      if (data && data.from_user_id && data.to_user_id && data.noti_num &&
        data.to_user_id === $rootScope.userId && data.from_user_id != $stateParams.userId) {
        var user = _.findWhere($scope.users, {id: data.from_user_id});
        user.noti_num = data.noti_num;
      }
    };

    $scope.blockUser = function($event, id) {
      $event.stopPropagation();
      updateBlockStatus(id);
    };

    $scope.go = function(user) {
      $location.path('/t/' + user.session_id + '/' + user.id);
      $rootScope.targetUserName = user.user_name;
      $rootScope.targetAvatarUrl = user.avatar_url;
    };

    socket.on('notification:save', updateNotification);

  });