'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/t/:roomId/:userId',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  })
