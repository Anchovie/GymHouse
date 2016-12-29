$(document).ready(function(){
	$(".card").click(function(){
		var trainer_data = $(this).attr("data-trainer");
		console.log(trainer_data);
		trainer_data = trainer_data.split("-");
		$(".panel-title").empty();
		$(".panel-title").html(trainer_data[0] );
		$(".info_height").empty();
		$(".info_height").html("<b>Height: </b>" + trainer_data[1] );
		$(".info_weight").empty();
		$(".info_weight").html("<b>Weight: </b>" + trainer_data[2] );
		var class_list = classes[trainer_data[0]];
		var event_list = events[trainer_data[0]];
		
		var c_and_e_list = "";
		$.each(class_list, function(key, value){
			c_and_e_list += "<li class='list-group-item text-center'>"+value+"<span class='badge'>C</span></li>";
		});
		
		$.each(class_list, function(key, value){
			c_and_e_list += "<li class='list-group-item text-center'>"+value+"<span class='badge'>E</span></li>";
		});
		$(".c_and_e_list").empty();
		$(".c_and_e_list").append(c_and_e_list);
		$("#myModal").modal("show");
		
	})
});