app.controller("SubscriptionController", function($scope, Subscriptions) {
  
  
 $.getJSON("api/unit/" + getUrlParameter('uid') + "/subscriptions",function(subscriptions){
		$scope.subscriptions = subscriptions;
	});

 
  
  $scope.subscribe = function(oa){
	  	
  }

  $scope.unsubscribe = function(oa){

  }

  
  
});
