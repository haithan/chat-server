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
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('socket', function (socketFactory) {
    var myIoSocket = io.connect('http://chat.lvh.me:8123');

    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {

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
          $location.path('/login');
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
