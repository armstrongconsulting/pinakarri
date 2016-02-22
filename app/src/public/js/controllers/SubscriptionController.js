app.controller("SubscriptionController", function($scope,$http) {
  
  
  $http.get("api/unit/" + uid + "/subscriptions").success(function(subscriptions){
	$scope.subscriptions = subscriptions;
  });
 
  
  $scope.subscribe = function(oa){
	console.log("Subscribe " + oa);	  	
	$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
		$scope.subscriptions = subscriptions;
	});
  }

  $scope.unsubscribe = function(oa){
	console.log("Unsubscribe " + oa);	  	
	$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
		$scope.subscriptions = subscriptions;
	});
  }

  
  $scope.subscribeLeader = function(oa){
	console.log("Subscribe leader " + oa);	  	
	$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){
		$scope.subscriptions = subscriptions;
	});
  }

  $scope.unsubscribeLeader = function(oa){
	console.log("Unsubscribe leader " + oa);	  	
	$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){
		$scope.subscriptions = subscriptions;
	});
  }

  
  
});
