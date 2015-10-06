describe('Chat', function() {
  beforeEach(module('chatApp'));

  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($rootScope, $http, $controller, socket) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should create $scope.emojiPopup equal false', function() {
    console.log("scope = ", scope);
    expect(scope.greeting).toBeUndefined();
  })
})