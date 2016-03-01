app.controller("SubscriptionController", function($scope,$http,$timeout,$q) {
  
  $scope.processing = "";
 
  $scope.alerts = [];
  
  var fetch_subscriptions = function(){
	  	$http.get("api/unit/" + uid + "/subscriptions").success(function(subscriptions){
		$scope.subscriptions = subscriptions;
	  });
  }

  fetch_subscriptions();


  var submit = function submit(oa, callback){

	if ($scope.processing != "") return;
 	$scope.processing = oa;
	$scope.alerts = [];

  	$timeout(function() {
  		callback();
    }, 100, false);
	    
  };

  $scope.subscribe = function(oa){

  	submit(oa, function() {
        	$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
			$scope.processing = "";
			$scope.alerts.push({type:'success', msg:'You subscribed to ' + oa});
			$scope.subscriptions = subscriptions;
			$scope.$emit("subscription_changed", {action:'add', activity: oa , type : 'P'});
		}).error(function(data, status) {
			$scope.processing = "";
			if (status == 400){
	  			$scope.alerts.push({type:'danger', msg:'Unable to get a seat for ' + oa + ': '+ data});
			}
			fetch_subscriptions();
		});

    });
  }

  $scope.unsubscribe = function(oa){

	submit(oa, function() {
		$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=P").success(function(subscriptions){
			$scope.processing = "";
			$scope.alerts.push({type:'info', msg:'You un-subscribed from ' + oa});
			$scope.subscriptions = subscriptions;
			$scope.$emit("subscription_changed", {action:'remove', activity: oa , type : 'P'});
		});

	});

  }

  
  $scope.subscribeLeader = function(oa){

  	submit(oa, function() {
		$http.post("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){		
			  	$scope.processing = "";
				$scope.alerts.push({type:'success', msg:'You subscribed a leader to ' + oa});
				$scope.subscriptions = subscriptions;
				$scope.$emit("subscription_changed", {action:'add', activity: oa , type : 'L'});
			}).error(function(data, status) {
			  	$scope.processing = "";
				if (status == 400){
		  			$scope.alerts.push({type:'danger', msg:'Unable to get a seat for ' + oa + ': '+ data});
				}
				fetch_subscriptions();
			});
    });

  }

  $scope.unsubscribeLeader = function(oa){

	submit(oa, function() {
		$http.delete("api/unit/" + uid + "/subscription/" + oa + "?type=L").success(function(subscriptions){
			$scope.processing = "";
			$scope.alerts.push({type:'info', msg:'You un-subscribed a leader from ' + oa});
			$scope.subscriptions = subscriptions;
			$scope.$emit("subscription_changed", {action:'remove', activity: oa , type : 'L'});
		});
	});
  }


  
});

