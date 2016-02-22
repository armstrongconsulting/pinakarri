app.controller("SubscriptionController", function($scope,$http) {
  
  $scope.alerts = [];
  
  $http.get("api/unit/" + uid + "/subscriptions").success(function(subscriptions){
	$scope.subscriptions = subscriptions;
  });
 
  
  $scope.subscribe = function(oa){
  	$scope.alerts = [];
	console.log("Trying to subscribe to " + oa);	  	
	$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
		$scope.alerts.push({type:'success', msg:'You subscribed to ' + oa});
		$scope.subscriptions = subscriptions;
	}).error(function(data, status) {
		if (status == 400){
  			$scope.alerts.push({type:'danger', msg:'Unable to get a seat for ' + oa + ': '+ data});
		}else
  			console.error('Failed to subscribe (%s): %s', status, data);
	});
  }

  $scope.unsubscribe = function(oa){
  	$scope.alerts = [];
	console.log("Unsubscribe " + oa);	  	
	$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
		$scope.alerts.push({type:'info', msg:'You un-subscribed from ' + oa});
		$scope.subscriptions = subscriptions;
	});
  }

  
  $scope.subscribeLeader = function(oa){
  	$scope.alerts = [];
	console.log("Subscribe leader " + oa);	  	
	$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){
		$scope.alerts.push({type:'success', msg:'You subscribed a leader to ' + oa});
		$scope.subscriptions = subscriptions;
	}).error(function(data, status) {
		if (status == 400){
  			$scope.alerts.push({type:'danger', msg:'Unable to get a seat for ' + oa + ': '+ data});
		}else
  			console.error('Failed to subscribe (%s): %s', status, data);
	});
  }

  $scope.unsubscribeLeader = function(oa){
  	$scope.alerts = [];
	console.log("Unsubscribe leader " + oa);	  	
	$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){
		$scope.alerts.push({type:'info', msg:'You un-subscribed a leader from ' + oa});
		$scope.subscriptions = subscriptions;
	});
  }

  
});
