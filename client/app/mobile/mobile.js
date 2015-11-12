'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mobile', {
        url: '/mobile',
        templateUrl: 'app/mobile/mobile.html',
        controller: 'MobileCtrl'
      });
  });
