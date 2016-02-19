app.controller("SubscriptionController", function($scope, Subscriptions) {
  
  
  Subscriptions.query(function(data) {
    $scope.activities = data;
  });
 
  
  $scope.subscribe = function(oa){
	  	
  }

  $scope.unsubscribe = function(oa){

  }

  
  
});