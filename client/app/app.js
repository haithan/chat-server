'use strict';

angular.module('chatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'perfect_scrollbar',
  'dbaq.emoji',
  'angular-click-outside',
  'angularSpinner',
  'luegg.directives'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/t//');


    $locationProvider.html5Mode(true);
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('socket', function (socketFactory) {
    var myIoSocket = io.connect('http://chat.lvh.me:8123');
    // var myIoSocket = io.connect('https://chat.ymeet.me');

    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, $window) {

    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('auth_token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('auth_token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          alert('Bạn chưa đăng ký dịch vụ ymeet.me. Vui lòng đăng ký trước khi sử dụng dịch vụ chat. Xin cám ơn.');
          return $window.location.href = 'http://ymeet.me';
          // remove any stale tokens
          $cookieStore.remove('auth_token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function (Auth, $rootScope, Mobile, $location) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (Mobile.detect()) {
        $location.path('/mobile');
      } else {
        Auth.auth();
      }
    });
  });
