'use strict';

angular.module('chatApp')
  .controller('LoginCtrl', function ($scope, Auth, socket, $state, $window, $rootScope) {
    console.log(1);
    socket.on('connect', function () {
      console.log(2);
      Auth.auth()
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
      };
      $rootScope.userId = data.user_id;
      $state.go('main');
    }
  });