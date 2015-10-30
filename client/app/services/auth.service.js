'user strict';

angular.module('chatApp')
  .factory('Auth', function ($http, $rootScope, $window) {
    // Service logic
    // ...
    var authenticate = function(data) {
      if (data.user_id === false) {
        alert('Bạn chưa đăng ký dịch vụ ymeet.me . Vui lòng đăng ký trước khi sử dụng dịch vụ chat. Xin cám ơn.');
        $window.location.href = 'http://ymeet.me';
        return;
      };
      $rootScope.userId = data.user_id;
    }
    // Public API here
    return {
      auth: function() {
        if (typeof $rootScope.userId === 'undefined') {
          $http.get('/auth')
            .success(function(data) {
              authenticate(data);
            })
            .error(function() {
              alert('Có lỗi kết nối. Vui lòng liên hệ admin để kiểm tra. Xin cám ơn.');
              $window.location.href = 'http://ymeet.me';
            })
        }
      }
    };
  });