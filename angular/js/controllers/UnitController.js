app.controller("UnitController", function($scope, Unit) {
  
 	$.getJSON("api/unit/" + getUrlParameter('uid'),function(unit){
		$scope.unit = data;
	});
  
  
});
