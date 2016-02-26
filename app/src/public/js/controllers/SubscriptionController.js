app.controller("SubscriptionController", function($scope,$http,$timeout) {
  
  $scope.processing = false;

  $scope.alerts = [];
  
  $http.get("api/unit/" + uid + "/subscriptions").success(function(subscriptions){
	$scope.subscriptions = subscriptions;
  });

  $scope.subscribe = function(oa){
 		if ($scope.processing) return;
 		$scope.processing = true;
	  	$scope.alerts = [];
		$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
			$scope.processing = false;
			$scope.alerts.push({type:'success', msg:'You subscribed to ' + oa});
			$scope.subscriptions = subscriptions;
			$scope.$emit("subscription_changed", {action:'add', activity: oa , type : 'P'});
		}).error(function(data, status) {
			$scope.processing = false;
			if (status == 400){
	  			$scope.alerts.push({type:'danger', msg:'Unable to get a seat for ' + oa + ': '+ data});
			}
		});
  }

  $scope.unsubscribe = function(oa){
  	$scope.alerts = [];
	$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
		$scope.alerts.push({type:'info', msg:'You un-subscribed from ' + oa});
		$scope.subscriptions = subscriptions;
		$scope.$emit("subscription_changed", {action:'remove', activity: oa , type : 'P'});
	});
  }

  
  $scope.subscribeLeader = function(oa){
  	if ($scope.processing) return;
  	$scope.processing = true;
  	$scope.alerts = [];
	$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){		
	  	$scope.processing = false;
		$scope.alerts.push({type:'success', msg:'You subscribed a leader to ' + oa});
		$scope.subscriptions = subscriptions;
		$scope.$emit("subscription_changed", {action:'add', activity: oa , type : 'L'});
	}).error(function(data, status) {
	  	$scope.processing = false;
		if (status == 400){
  			$scope.alerts.push({type:'danger', msg:'Unable to get a seat for ' + oa + ': '+ data});
		}
	});
  }

  $scope.unsubscribeLeader = function(oa){
  	$scope.alerts = [];
	$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){
		$scope.alerts.push({type:'info', msg:'You un-subscribed a leader from ' + oa});
		$scope.subscriptions = subscriptions;
		$scope.$emit("subscription_changed", {action:'remove', activity: oa , type : 'L'});
	});
  }

  
});
