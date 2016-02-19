var app = angular.module("pinakarriApp", ['ngResource']);

app.factory("Subscriptions", function($resource) {
	  return $resource("subscriptions");
	});

app.factory("Unit", function($resource) {
	  return $resource('unit/:guid', {guid:'@guid'});
});

app.directive('toggle', function(){
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs){
	      if (attrs.toggle=="tooltip"){
	        $(element).tooltip();
	      }
	    }
	  };
	});

