var personal_toggle = false;

function togglePersonal() {
  var div = document.getElementById('p-info');
  personal_toggle = div.style.display == "none" ? false : true;

  if (personal_toggle){
    $(".show-personal-text").html("Show personal information");
    div.style.display = "none";
  } else {
    $(".show-personal-text").html("Hide personal information");
    div.style.display = "block";
  }
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

});
