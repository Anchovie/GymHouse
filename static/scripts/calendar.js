/*global db_events*/

//Month number 1...12
getMonthName = function(month){
    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[(month-1)];
};

expand = function(entry){
    var entryType;
    var pk;
    var entryObj;
    var date=entry.attr("data-date");

    if ($(entry).hasClass('multiple')){     //TWO IN ONE
        console.log("multiple entries in one clicked pk=???");

    } else if ($(entry).hasClass('timeevents')){    //EVENT
        pk = parseInt(entry.attr("data-event-pk"));
        entryObj = event_pk_mapper[pk];
        entryType = "EVENT";

    } else if ($(entry).hasClass('timeclasses')){   //CLASS
        pk = parseInt(entry.attr("data-class-pk"));
        entryObj = class_pk_mapper[pk];
        entryType = "CLASS";
    }

    $expand_dialog = $(
        "<div class='dialog' data-entry-pk='"+pk+"'>  "+
            "<b>" + entryType + "</b><br/>" +
            " "+ entryObj.fields.name + "<br/> " +
            " "+ users[entryObj.fields.trainer] + "<br/> " +
            "Description: " + entryObj.fields.description + " <br/>" +
            "click to close <br/>"+
            "<button class='register'>Register</button>"+
        "</div> " +
        " "
    );

  

    $(".col-lg-12").append($expand_dialog);
    $(".register").click(function(){
        console.log("REGISTER PRESSED");
        register(entryObj, entryType, date);
    });
    $(".dialog").click(function(e){
        if (e.target != $(".register"))
            $(".dialog").remove();
    });
};

register = function(entryObj, entryType, date){
    console.log("AJAX MAGIC HERE");
    console.log(entryObj);
    var JS = JSON.stringify(entryObj);
    console.log(JS);



    console.log(entryType);
    entryType = entryType.charAt(0);
    console.log(entryType);
/*
    var date;
    if (entryType=="E"){
        date=entryObj.fields.date;
        console.log("date");    
        console.log(date);
    }*/

    $.ajax({
        type: "POST",
        url: "ajax/register/",
        data: {
            csrfmiddlewaretoken: Cookies.get('csrftoken'),
            JS,
            eType: entryType,
            dateOfEntry: date,

        },
        dataType: 'json',
        success: function(results) {
            //$('#result_text').html(results.text);
            console.log("Ok, REGISTRATION SAVED", results);
            //changeView("result")
        },
        error: function(error) {
            console.log(error);
        }
    });
};


addDatesToCalendar = function(week, year, label){
	var formatted_curr_date;
	var classes_this_week = {};
   

    console.log("creating new moment with week " + week +" and year " + year);
    var currentMonday = new moment().year(year).isoWeek(week);
	console.log("moment currentMonday before prev/next = " + currentMonday);
    console.log("label = " + label);
	if(label == "prev") {
		currentMonday = currentMonday.subtract(1,'week');
	} else /*if (label =='next') */{
		currentMonday = currentMonday.add(1,'week');
	}

    console.log("moment currentMonday = " + currentMonday);
    console.log("moment currentMonday.format = " + currentMonday.format("DD/MM/YYYY"));

    currentMonday.isoWeekday(1);
    year = currentMonday.year();
    console.log("Set year according to currentMonday = " + year);

    console.log("Setting currentMonday to monday of the week: " + currentMonday.format("DD/MM/YYYY"));



    $(".dayElementContainer").html(""); //clear the container before rendering
    var $dayElement;
    var month = currentMonday.month()+1;
    var month2 = currentMonday.clone().add(6,'days').month()+1;
    console.log("month1 =" + month +" month2 = " + month2);


    var lastDay = currentMonday.clone().add(6,'days').date();
	
	classes_this_week = db_classes.filter(function(elem){
		if((currentMonday.isoWeek() >= moment(elem.fields.begin_date).isoWeek()) && (currentMonday.isoWeek() <= moment(elem.fields.end_date).isoWeek()))
			return elem;
		else if((currentMonday.isoWeek() >= moment(elem.fields.begin_date).isoWeek()) && (currentMonday.year() < moment(elem.fields.end_date).year()) && (currentMonday.year() == moment(elem.fields.begin_date).year())) 
			return elem;
		else if((currentMonday.year() > moment(elem.fields.begin_date).year()) && (currentMonday.isoWeek() <= moment(elem.fields.end_date).isoWeek()) && (currentMonday.year() == moment(elem.fields.end_date).year()))
			return elem;
		else if((currentMonday.year() > moment(elem.fields.begin_date).year()) && (currentMonday.year() < moment(elem.fields.end_date).year()))
			return elem;
	});
		
	console.log(classes_this_week);

    for(var i = 0; i < 7; i++){
        var currentDay = currentMonday.clone().add(i,'days');   
        var currentMoment = currentDay;
        currentDay = currentDay.date();
        var currentMonth = currentMoment.month()+1;
        //lastDay
        console.log("currentDay = " + currentDay + ", month=" + currentMonth +" lastDay =" + lastDay);
        
        if(i==6){
            month2=currentMonth;
        }
        


        
        //console.log("Calculating days i="+i+". Current: "+currentDay+", NEWlast"+lastDay);
		
		formatted_curr_date = year + "-" + currentMonth + "-"  + currentDay;

        $dayElement = $(
            "<div class='dayElement' id="+i+">" +
                "<div class='dayOfMonth'>"+currentDay+"/"+currentMonth+"</div>" +
                "<div class='classes'>" +
                    "<div class='timeSlots'></div>" +
                "</div>" +
            "</div>"
        );
        var mom = new moment();
        if (currentDay == mom.date() && currentMonth == mom.month()+1){
            $dayElement.find(".dayOfMonth").addClass("active");
            //$(".weekdays").find("#"+i).addClass("active");
        }


        for (var j = 8; j<20; j++){
			var events_flag = false;
			var class_flag = false;
			var class_str = "";
			
			if(events_dict[formatted_curr_date] || classes_this_week.length > 0) {
				if(events_dict[formatted_curr_date]) {
					if(events_dict[formatted_curr_date][0].has(j.toString())){
                        var currEventPk = events_dict[formatted_curr_date][0].get(j.toString()).pk;
                        var currEventName = event_pk_mapper[currEventPk].fields.name;
                        var currEventTrainerPk = event_pk_mapper[currEventPk].fields.trainer;
                        var currEventTrainer = users[currEventTrainerPk];

						class_str +=
						     "<div id='"+ i + "_" + (j-8) +"' data-event-pk='" + currEventPk.toString() + 
                                "' data-date='"+formatted_curr_date+"' class='timeevents'>" +
							 "<em>" + currEventName + "</em><br />" +
							 "<span class='trainer'>" + currEventTrainer + "</span><br />" +
							 "</div>";
							 
						events_flag = true;
					} 
				}
				if(classes_this_week.length > 0) {
					for(var i_cls = 0; i_cls < classes_this_week.length; i_cls++){
						if((classes_this_week[i_cls].fields.days).includes(i + 1)) {
							if(classes_this_week[i_cls].fields.time == j.toString()) {
								if(events_flag === false) {
                                    var currClassPk = classes_this_week[i_cls].pk;
                                    var currClassName = class_pk_mapper[currClassPk].fields.name;
                                    var currClassTrainerPk = class_pk_mapper[currClassPk].fields.trainer;
                                    var currClassTrainer = users[currClassTrainerPk];

									class_str = "<div id='"+ i + "_" + (j-8) +"' data-class-pk='"+ 
                                        currClassPk +"' data-date='"+formatted_curr_date+"' class='timeclasses " + 
                                        levels[classes_this_week[i_cls].fields.level] +"'>";
									class_str += "<em>" + currClassName + "</em><br />" +
									 "<span class='trainer'>" + currClassTrainer + "</span><br />";
									class_str += "</div>";
								} else {
									//$dayElement.find(".timeSlots").append("--------");
									class_str = "";
									
									class_str = "<div id='"+ i + "_" + (j-8) +"' class='timeevents timeclasses multiple'>";
									class_str += "<em>" + events_dict[formatted_curr_date][0].get(j.toString()).fields.name + "</em><br />" +
										"-----<br />" +
										"<em>" + classes_this_week[i_cls].fields.name + "</em>";
										
									class_str += "</div>";
								}
								
								class_flag = true;
							}
							
						}
					}
					//$dayElement.find(".timeSlots").append("</div>");
					//$dayElement.find(".timeSlots").append(class_str);
				}
				
				if(events_flag === false && class_flag === false) {
					class_str +=
						"<div id='"+ (j-8) +"' class='time'>" + 
							"" +
						"</div>";
				}
				$dayElement.find(".timeSlots").append(class_str);
			} else {			
				$dayElement.find(".timeSlots").append(
					"<div id='"+ (j-8) +"' class='time'>" + 
						"" +
					"</div>"
				);
			}
        }
        console.log("---------__");
        $dayElement.find('.timeclasses').click(function() {
            var $this = $(this);
            expand($this);
        });
        $dayElement.find('.timeevents').click(function() {
            var $this = $(this);
            expand($this);
        });

        $(".dayElementContainer").append($dayElement);
    }
    console.log("#######################");
    //$(".weeknumber").text("Week "+ week);
	$(".weeknumber").text("Week "+ currentMonday.isoWeek());
    var monthName = getMonthName(month);
    if (month != month2)
        monthName += ("/"+getMonthName(month2));
    //$(".monthYear").text(monthName +", " + year);
	$(".monthYear").text(monthName +", " + currentMonday.isoWeekYear());

	var nextWeekMoment = currentMonday;
	
	/*
	if(label == "prev") {
		nextWeekMoment = currentMonday.subtract(1,'week');
	} else {
		nextWeekMoment = currentMonday.add(1,'week');
	}
	*/
    
    console.log("nextWeekMoment = " + nextWeekMoment.format("DD/MM/YYYY"));
    console.log("Isoweek: " + nextWeekMoment.isoWeek());
	
	return [nextWeekMoment.isoWeek(),nextWeekMoment.isoWeekYear()];
};

var events_dict = {};
var classes_dict = {};
var event_pk_mapper = {};
var class_pk_mapper = {};



$(document).ready(function(){
    

    console.log("DB_EVENTS:");
    console.log(db_events);
    console.log("\nDB_CLASSES:");
    console.log(db_classes);



	var map;
    for (var i = 0; i < db_events.length; i++){
        //console.log(db_events[i].fields.date);
		if(!events_dict[db_events[i].fields.date]) {
			map = new Map();
			events_dict[db_events[i].fields.date] = [];
			events_dict[db_events[i].fields.date].push(map.set(db_events[i].fields.time, db_events[i]));
		} else {
			map = events_dict[db_events[i].fields.date][0];
			map.set(db_events[i].fields.time, db_events[i]);
		}
        event_pk_mapper[db_events[i].pk] = db_events[i];
    }
    for (var i = 0; i < db_classes.length; i++){
        class_pk_mapper[db_classes[i].pk] = db_classes[i];
    }

	
	console.log(events_dict);
	console.log("\nISO WEEK OF start date \n" + (moment(db_classes[0].fields.begin_date)).isoWeek());
	
	
	for (var i = 0 ; i < db_classes.length ; i++) {
		classes_dict[i] = new Array(db_classes[i], moment(db_classes[i].fields.begin_date).isoWeek(), moment(db_classes[i].fields.end_date).isoWeek());
	}

    var m = new moment();
    console.log("MOMENT : " + m.format("DD/MM/YYYY"));
    var myear = m.year();
    var mmonth = m.month() +1;
    var mday = m.date();
    var mweekday = m.isoWeekday();
    var mweek = m.isoWeek();
	mweek = mweek - 1;

    console.log("MOMENT DMY: " + myear + " " + mmonth +
        " " + mday + " " + mweekday + " week: " + mweek);


    var ar_init = addDatesToCalendar(mweek,myear);
	mweek = ar_init[0] ;
    myear = ar_init[1];


    //Add hours to column "hours"
    for(var i = 0; i<12; i++){
        $(".timeLabel").find(".hours").append(
            "<div class='hour'>"+(i+8)+ "\xa0-\xa0" + (i+9) + "</div>"
        );
    }



    $(".prev").click(function(){
        console.log("clicked PREVIOUS!");
        var ar = addDatesToCalendar(mweek,myear, "prev");
        mweek = ar[0] ;
        myear = ar[1];
    });
    $(".next").click(function(){
        console.log("clicked NEXT!");
        var ar = addDatesToCalendar(mweek,myear, "next");
        mweek = ar[0];
        myear = ar[1];
    });
    
	
});
