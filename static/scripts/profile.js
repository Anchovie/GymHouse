var personal_toggle = false;

var toggle_personal = function(){
  console.log(personal_toggle);
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
};

$(document).ready(function(){
	$(".show-personal").click(toggle_personal);

  $(".edit-profile").click(function(){
    console.log("EDIT PROFILE");
    //Make the information editable, add submit button to trigger ajax,
    // implement a correct view to receive ajax and update Profile model



  });

});
