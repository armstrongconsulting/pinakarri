
$(document).ready(function(){

	$.getJSON("api/unit/" + getUrlParameter('uid'),function(unit){
			$("#unit_name").text(unit.name);
			$("#unit_identifier").text(unit.identifier);
	
			window.setInterval(function(){
			$.getJSON("api/unit/" + getUrlParameter('uid') + "/subscriptions",function(subscriptions){
					toggle_buttons(subscriptions);
				});

			}, 10000);

		});


		
	$('#row_template').hide();
	
	$.getJSON("api/unit/" + getUrlParameter('uid') + "/subscriptions",function(subscriptions){
		subscriptions.forEach(function(s) {
    		$(".table tr:last").after($('<tr>' + nano($('#row_template').html(),s) + '</tr>'));
		});

		toggle_buttons(subscriptions);
	});

});

function toggle_buttons(subscriptions){

	$("button").each(function(index){
		if ($(this).is(":visible")){
			var activity = $(this).attr('activity');
			var type = $(this).attr('t');
			var number = $(this).attr('n')
			var s = get_subscription(subscriptions,activity);
			var button = $(this);
			

		}

	});
}


function get_subscription(subscriptions, identifier){
	for (var i = 0; i < subscriptions.length; i++) {
   	   if (subscriptions[i].identifier == identifier)
   	   		return subscriptions[i];
 	} 
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};