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
            $(".registrations").find(".entry[data-pk="+ pk +"]").remove();
            //changeView("result")
			/*
			//$(".modal-body > p").empty();
			//$(".modal-body > p").append("Registration successful");
			setTimeout(function(){
				console.log("Ready to click");
				$(".modal-header > button").click();
			}, 700);*/
        },
        error: function(error) {
            console.log(error);
        }
    });
};




$(document).ready(function(){
	$(".registrations").find(".remove_entry").click(function(){

		console.log("remove!");
		console.log($(this).attr("data-pk"));
		remove($(this).attr("data-pk"));
	});

});