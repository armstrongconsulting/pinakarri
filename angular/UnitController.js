app.controller("UnitController", function($scope, Unit) {
  
  
  Unit.get({guid:'guid1'},function(data) {
    $scope.unit = data;
  });
  
  
});