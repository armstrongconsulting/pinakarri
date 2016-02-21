 app.controller("UnitController", function($scope,$location,$http) {
 
  $http.get("api/unit/" + uid).success(function(unit){
	$scope.unit = unit;
  });
  
});
