'user strict';

angular.module('chatApp')
  .factory('Auth', function ($http, $rootScope, $window, $cookieStore) {
    // Service logic
    // ...
    var authenticate = function(data) {
      if (data && data.user_id) {
        $rootScope.userId = data.user_id;
        $cookieStore.put('auth_token', data.auth_token);
      } else {
        $cookieStore.remove('auth_token');
        return $window.location.href = 'http://ymeet.me';
      }
    }
    // Public API here
    return {
      auth: function() {
        if (typeof $rootScope.userId === 'undefined') {
          $http.get('/auth')
            .then(function successCallback(res) {
              authenticate(res.data);
            }, function errCallback(res) {
              if (res.status == 403) {
                $cookieStore.remove('auth_token');
                alert('Bạn chưa đăng ký dịch vụ ymeet.me. Vui lòng đăng ký trước khi sử dụng dịch vụ chat. Xin cám ơn.');
                return $window.location.href = 'http://ymeet.me';
              } else {
                $cookieStore.remove('auth_token');
                alert('Có lỗi kết nối. Vui lòng liên hệ admin để kiểm tra. Xin cám ơn.');
                return $window.location.href = 'http://ymeet.me';
              }
            });
        }
      }
    };
  });