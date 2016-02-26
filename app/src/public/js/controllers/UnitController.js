 app.controller("UnitController", function($scope,$location,$http) {
 
  fetch_unit();

  function fetch_unit(){
	$http.get("api/unit/" + uid).success(function(unit){

		unit.completed = {
			leaders: Math.ceil(unit.tickets.leaders.length * 100 / unit.leaders),
			participants: Math.ceil(unit.tickets.participants.length * 100 / unit.participants),
		};

		$scope.unit = unit;
	 });
  }

  $scope.$on("subscription_changed", function (event, args) {
   	fetch_unit();
  });
  
});
