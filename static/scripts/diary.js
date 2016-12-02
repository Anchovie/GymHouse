$(document).ready(function(){
	$(".registrations").find(".remove_entry").click(function(){

		console.log("remove!");
		console.log($(this).attr("data-pk"));
	});

});