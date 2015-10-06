'use strict';

angular.module('chatApp')
  .directive('content', function() {
    return function (scope, element, attrs) {
      element.height($(window).height() - $('.chat-input').outerHeight() - 105);
    }
  })

  .directive('scrollToLast', ['$location', '$anchorScroll', function ($location, $anchorScroll) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        $location.hash(iAttrs.scrollToLast);
        $anchorScroll();
      }
    };
  }])

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