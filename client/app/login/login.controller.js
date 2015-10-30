'use strict';

angular.module('chatApp')
  .controller('LoginCtrl', function ($scope, $state, usSpinnerService) {
    usSpinnerService.spin('spinner-1');
    $state.go('main');
  });