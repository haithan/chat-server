'use strict';

angular.module('chatApp')
  .controller('SideBarCtrl', function ($scope, User, Match, $rootScope, $location,
                                       Block, Notification, Message, $stateParams,
                                       $timeout, socket, chatUtils) {
    Match.getMatchs($rootScope.userId).success(function(datas) {
      initMatchUsers(datas);
    });

    var initMatchUsers = function(datas) {
      var users = [];
      angular.forEach(datas, function(data) {
        var user = {};
        user.id = data.target_id;
        user.session_id = data.session_id;
        users.push(user);
      });

      async.each(users, initUser, function(err) {
        $scope.users = users;

        //auto join first room if no chat room
        if($stateParams.roomId == '' || $stateParams.userId == '') {
          $location.path('/t/' + $scope.users[0].session_id + '/' + $scope.users[0].id);
        } else {
          $timeout(function() {
            $('#'+ $stateParams.userId).addClass('active');
          },200);
        }
      });

    };

    var initUser = function(user, callback) {
      async.waterfall([
        function(cb) {
          User.getUser(user.id).success(function(data) {
            user.user_name = data.name;
            user.avatar_url = data.avatar_url;
            cb(null, user);
          })
        },
        function(user, cb) {
          user.noti_num = 0;
          Notification.getNotificationNum(user.id, $rootScope.userId)
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
          Block.getBlockStatus($rootScope.userId, user.id)
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

    var createOrUpdateBlock = function(id) {
      var index = chatUtils.findIndexByUserId(id, $scope.users);
      var block = !$scope.users[index].block;

      Block.updateBlockStatus($rootScope.userId, id, block)
        .success(function() {
          $scope.users[index].block = block;
        });
    };

    $scope.blockUser = function($event, id) {
      $event.stopPropagation();
      createOrUpdateBlock(id);
    };

    $scope.go = function(user) {
      $location.path('/t/' + user.session_id + '/' + user.id);
    };

    socket.on('notification:save', function(data) {
      if (data && data.from_user_id && data.to_user_id && data.noti_num &&
        data.to_user_id === $rootScope.userId && data.from_user_id != $stateParams.userId) {
        var user = _.findWhere($scope.users, {id: data.from_user_id});
        user.noti_num = data.noti_num;
      }
    });

  });