var personal_toggle = false;

function togglePersonal() {
	/*
  var div = document.getElementById('p-info');
  personal_toggle = div.style.display == "none" ? false : true;

  if (personal_toggle){
    $(".show-personal-text").html("Show personal information");
    div.style.display = "none";
  } else {
    $(".show-personal-text").html("Hide personal information");
    div.style.display = "block";
  }
  */
  //div.style.display = div.style.display == "none" ? "block" : "none";
}

var toggle_personal = function(){
  console.log(personal_toggle);
  togglePersonal();
  /*
  if (personal_toggle==false){
    personal_toggle=true;
    $(".show-personal-text").html("Show personal information");
    console.log("SHOW PERSONAL INFO!");

    // DO SOME CSS MAGIC HERE TO SHOW THE PERSONAL INFO
  } else {
    personal_toggle=false;
    $(".show-personal-text").html("Hide personal information");
    console.log("HIDE PERSONAL INFO!");
    // CSS MAGIC TO HIDE IT
  }
  */
};

$(document).ready(function(){
  toggle_personal();
	$(".show-personal").click(toggle_personal);

  $(".edit-profile").click(function(){
    console.log("EDIT PROFILE");
    //Make the information editable, add submit button to trigger ajax,
    // implement a correct view to receive ajax and update Profile model
  });
  
  $("#disp_picture").change(function () {
		console.log("here");
		var reader = new FileReader();

		reader.onload = function (e) {
			// get loaded data and render thumbnail.
			document.getElementsByClassName("img-rounded")[0].src = e.target.result;
		};

		// read the image file as a data URL.
		reader.readAsDataURL(this.files[0]);
	});
	
	$("#submit").click(function(event){
		event.preventDefault();
		var form_dict = {};
		var form_data = $('form').serializeArray();
		console.log(form_data);
		form_dict.name = form_data[0]['value'];
		form_dict.age = form_data[1]['value'];
		form_dict.level = form_data[2]['value'];
		form_dict.height = form_data[3]['value'];
		form_dict.weight = form_data[4]['value'];
		console.log(form_dict);
		save_profile(form_dict);
	})
	
	var click_count = 0;
	
	$(".caret_sym").click(function(){
		click_count++;
		if(click_count % 2 != 0){
			$(".text-info[hide='yes']").show("slow", function(){
				$(".caret_sym").empty();
				$(".caret_sym").html("&#9650;");
			});
		} else {
			$(".text-info[hide='yes']").hide("slow", function(){
				$(".caret_sym").empty();
				$(".caret_sym").html("&#9660;");
			});
		}
	})

});

function save_profile(form_dict) {
	$.ajax({
        type: "POST",
        url: "ajax/edit_profile/",
        data: {
            csrfmiddlewaretoken: Cookies.get('csrftoken'),
            name: form_dict['name'],
			age: form_dict['age'],
			height: form_dict['height'],
			weight: form_dict['weight'],
			level: form_dict['level'],
        },
        dataType: 'json',
        success: function(results) {
            $("#myModalNorm").modal('hide');
        },
        error: function(error) {
            console.log(error);
        }
    });
}
