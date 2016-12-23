remove = function(pk){
	$.ajax({
        type: "POST",
        url: "ajax/remove_entry/",
        data: {
            csrfmiddlewaretoken: Cookies.get('csrftoken'),
            entryPk: pk,

        },
        dataType: 'json',
        success: function(results) {
            //$('#result_text').html(results.text);
            console.log("Ok, REGISTRATION REMOVED", results);
            $(".registrations").find(".panel[data-pk="+ pk +"]").remove();
            //changeView("result")
			/*
			//$(".modal-body > p").empty();
			//$(".modal-body > p").append("Registration successful");
			setTimeout(function(){
				console.log("Ready to click");
				$(".modal-header > button").click();
			}, 700);*/
			var badge_str = $(".badge:first").text().replace('[', '').replace(']', '');
			var badge_count = parseInt(badge_str);
			$(".badge:first").empty();
			$(".badge:first").append("[" + --badge_count + "]");
        },
        error: function(error) {
            console.log(error);
        }
    });
};

add_comment = function(comment, pk, comment_id, parent_id){
	$.ajax({
        type: "POST",
        url: "ajax/add_comment/",
        data: {
            csrfmiddlewaretoken: Cookies.get('csrftoken'),
            comment: comment,
			entryPk: pk,
        },
        dataType: 'json',
        success: function(results) {
			$(".comm_area[comm-id="+comment_id+"]").remove();
			var comment_html = "<div class='comment_area' comm-id="+comment_id+" data-pk="+pk+">" +
								comment+
								"</div>";
			$("#"+parent_id).find(".panel-body").html(comment_html);
        },
        error: function(error) {
            console.log(error);
        }
    });
};



$(document).ready(function(){
	$(".registrations").find(".remove_entry").click(function(event){
		event.preventDefault();
		console.log("remove!");
		console.log($(this).attr("data-pk"));
		remove($(this).attr("data-pk"));
	});
	/*
	$(".add_comment").click(function(event){
		var parent_id = $(this).parent().parent().parent().attr("id");
		console.log(parent_id);
		var comment_id = $(this).attr("data-comm");
		console.log(comment_id);
		add_comment($("#"+comment_id).val(), $(this).attr("data-pk"), comment_id, parent_id);
		
	});
	
	$(".comment_area").click(function(event){
		console.log("clicked");
		var comment_id = $(this).attr("comm-id");
		var data_pk = $(this).attr("data-pk");
		var parent_id = $(this).parent().parent().attr("id");
		var comment_text_area_html = "<div class='comm_area' comm-id="+comment_id+">" + 
										"<div class='form-group'>" +
										"<textarea class='form-control' rows='3' id="+comment_id+"></textarea>" +
										"</div>" +
										"<button class='add_comment btn-default' data-comm="+comment_id+" data-pk="+data_pk+">Add comment</button>" +
										"</div>";
		$(this).remove();
		$("#"+parent_id).find(".panel-body").html(comment_text_area_html);
	});
	*/
});

$(document).on('click', '.add_comment', function(event){
		var parent_id = $(this).parent().parent().parent().attr("id");
		console.log(parent_id);
		var comment_id = $(this).attr("data-comm");
		console.log(comment_id);
		add_comment($("#"+comment_id).val(), $(this).attr("data-pk"), comment_id, parent_id);
		
	});

$(document).on('click', '.comment_area', function(event){
		console.log("clicked");
		var comment_id = $(this).attr("comm-id");
		var data_pk = $(this).attr("data-pk");
		var parent_id = $(this).parent().parent().attr("id");
		var comment_text_area_html = "<div class='comm_area' comm-id="+comment_id+">" + 
										"<div class='form-group'>" +
										"<textarea class='form-control' rows='3' id="+comment_id+">"+$.trim($(this).text())+"</textarea>" +
										"</div>" +
										"<button class='add_comment btn-default' data-comm="+comment_id+" data-pk="+data_pk+">Add comment</button>" +
										"</div>";
		$(this).remove();
		$("#"+parent_id).find(".panel-body").html(comment_text_area_html);
	});