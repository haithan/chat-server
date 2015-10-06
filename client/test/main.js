describe('Chat', function() {
  var scope, createController;

  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(module('chatApp'));
  beforeEach(function() {

    inject(function($rootScope, $controller) {
      // Create a new scope that's a child of the $rootScope
      scope = $rootScope.$new();
      // Create the controller
      createController = function() {
        return $controller('MainCtrl', {
          $scope: scope,
        });
      }
    });
  });
  
  it('emojiPopup should be defined', function() {
    var ctrl = createController();
    expect(scope.emojiPopup).toBeDefined();
  });

  it('emojiPopup shoule be equal false', function() {
    var ctrl = createController();
    expect(scope.emojiPopup).toBe(false);
  });
})
