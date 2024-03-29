'use strict';

angular.module('chatApp')
  .directive('content', function() {
    return function (scope, element, attrs) {
      element.height($(window).height() - $('.chat-input').outerHeight() - 105);
    }
  })

  .directive('fallbackSrc', function () {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        iElement.bind('error', function() {
          angular.element(this).attr("src", iAttrs.fallbackSrc);
        });
      }
    };
  })

  .directive('autoFocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link : function(scope, iElement) {
        $timeout(function() {
          scope.$watch('autoFocus', function () {
            iElement[0].focus();
          });
        }, 0);
      }
    }
  }])

  .directive('scrollToTop', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        iElement.bind("scroll", function(e) {
          if (iElement[0].scrollTop <= 0) {
            var element = document.getElementById(scope.chats[0]._id);
            var chatContent = document.getElementById('chatContent');
            scope.loadMore();
            $timeout(function () {
              angular.element(chatContent).scrollTop(angular.element(element)[0].getBoundingClientRect().top - 80);
            },200);
          }
        })
      }
    };
  }]);