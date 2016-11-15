/*global db_events*/
/**
 *  Add a getWeek() method in Javascript inbuilt Date object.
 * This function is the colsest I could find which is ISO-8601 compatible. This is what php's `Date->format('w')` uses.
 * ISO-8601 means.
 *    Week starts from Monday.
 *    Week 1 is the week with first thurday of the year or the week which has 4th jan in it.
 * @param  {[Date]}   Prototype binding with Date Object. 
 * @return {[Int]}    Integer from 1 - 53 which denotes the week of the year.
 */
/*
Date.prototype.getWeek = function() { 

  // Create a copy of this date object  
  var target  = new Date(this.valueOf());  

  // ISO week date weeks start on monday, so correct the day number  
  var dayNr   = (this.getDay() + 6) % 7;  

  // Set the target to the thursday of this week so the  
  // target date is in the right year  
  target.setDate(target.getDate() - dayNr + 3);  

  // ISO 8601 states that week 1 is the week with january 4th in it  
  var jan4    = new Date(target.getFullYear(), 0, 4);  

  // Number of days between target date and january 4th  
  var dayDiff = (target - jan4) / 86400000;    

  if(new Date(target.getFullYear(), 0, 1).getDay() < 5) {
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    return 1 + Math.ceil(dayDiff / 7);    
  }
  else {  // jan 4th is on the next week (so next week is week 1)
    return Math.ceil(dayDiff / 7); 
  }
};
*/
//Month number 1...12
getMonthName = function(month){
    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[(month-1)];
};
/*
Date.prototype.getDayOfWeek = function() {
    return (new Date().getDay() || 7 - 1);
};


function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

//DOESNT WORK
function getWeekRange(weekNo){
    var d1 = new Date();
    var d2 = new Date();
    var numOfdaysPastSinceLastMonday = d1.getDay()- 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    var weekNoToday = d1.getWeek();
    var weeksInTheFuture = weekNo - weekNoToday;
    d1.setDate(d1.getDate() + ( 7 * weeksInTheFuture ));
    d2.setDate(d1.getDate() + 6);
    return [d1.getDate(),d1.getMonth()+1,d2.getDate(),d2.getMonth()+1];
}
*/
/*
function getWeekRange(dateStr) {
    if (!dateStr) dateStr = new Date().getTime();
    var dt = new Date(dateStr);
    dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    dt = new Date(dt.getTime() - (dt.getDay() > 0 ? (dt.getDay() - 1) * 1000 * 60 * 60 * 24 : 6 * 1000 * 60 * 60 * 24));
    dt2 = new Date(dt.getTime() + 1000 * 60 * 60 * 24 * 7 - 1);
    return [dt.getDate(), dt.getMonth()+1, dt2.getDate(), dt2.getMonth()+1];
}
*/


addDatesToCalendar = function(week, year, label){
	var formatted_curr_date;
	var classes_this_week = {};
    /*
    var date = new Date();

    //var dt = new Date(year, )

    //var month = date.getMonth() + 1; // month eg, 11

    //gets the month from the last day of the current week
    var month = getWeekRange(week)[1];
    var month2 =getWeekRange(week)[3];
    console.log("THE WEEK WERE CURRENTLY OBSERVING IS " + week + "," +year);
    console.log("MONTHS: " + month + ", " + month2);
    console.log("Week range: " + getWeekRange(week));
    console.log("Week range2 = " + getWeekRange(week));
    
    var dayToday = date.getDate();       //day eg. 21
    var firstDay = getWeekRange(week)[0];
    //var weekDay = date.getDayOfWeek();    //day of the week eg. 1. (monday)
    


    console.log("day = " + dayToday + "firstDay = " + firstDay);
    console.log("month =" + month);
    */

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


        //A new month started but the month variable holds the new month
        /*
        if (getWeekRange(week)[1]!=getWeekRange(week)[3]){
            console.log("MONTH CHANGED");
            if (currentDay <= lastDay) {
                currentMonth=month;
                console.log("CURRENTDAY NOT OF NEW MONTH");
            }
            else{
                currentMonth=month+1;
                if (month > 12) month = 1;
                if (month < 1 ) month = 12;
                currentDay = currentDay%lastDay;
                console.log("currentday IS NEW MONTH");
            }
            lastDay = daysInMonth(currentMonth, year);
            console.log("month: " + month +" currentmonth = " + currentMonth);
        }
        */
        console.log("Calculating days i="+i+". Current: "+currentDay+", NEWlast"+lastDay);
		
		formatted_curr_date = year + "-" + currentMonth + "-"  + currentDay;

        $dayElement = $(
            "<div class='dayElement' id="+i+">" +
                "<div class='dayOfMonth'>"+currentDay+"/"+currentMonth+"</div>" +
                "<div class='classes'>" +
                    "<div class='timeSlots'></div>" +
                "</div>" +
            "</div>"
        );


    /*
    for(var i = 0; i < 7; i++){
        var currentDay = firstDay+i;
        var currentMonth = month;
        var lastDay = daysInMonth(currentMonth,year);
        console.log("month: " + month +" currentmonth = " + currentMonth);
        //A new month started but the month variable holds the new month
        if (getWeekRange(week)[1]!=getWeekRange(week)[3]){
            console.log("MONTH CHANGED");
            if (currentDay <= lastDay) {
                currentMonth=month;
                console.log("CURRENTDAY NOT OF NEW MONTH");
            }
            else{
                currentMonth=month+1;
                if (month > 12) month = 1;
                if (month < 1 ) month = 12;
                currentDay = currentDay%lastDay;
                console.log("currentday IS NEW MONTH");
            }
            lastDay = daysInMonth(currentMonth, year);
            console.log("month: " + month +" currentmonth = " + currentMonth);
        }
        console.log("Calculating days i="+i+". Current: "+currentDay+", NEWlast"+lastDay);
        


        $dayElement = $(
            "<div class='dayElement' id="+i+">" +
                "<div class='dayOfMonth'>"+currentDay+"."+currentMonth+".</div>" +
                "<div class='classes'>" +
                    "<div class='timeSlots'></div>" +
                "</div>" +
            "</div>"
        );
    */

        for (var j = 8; j<20; j++){
			var events_flag = false;
			var class_flag = false;
			
			if(events_dict[formatted_curr_date] || classes_this_week.length > 0) {
				if(events_dict[formatted_curr_date]) {
					if(events_dict[formatted_curr_date][0].has(j.toString())){
						$dayElement.find(".timeSlots").append(
						"<div id='"+ i + "_" + (j-8) +"' class='timeevents'>" +
							 events_dict[formatted_curr_date][0].get(j.toString()).fields.name + "<br />" +
							 users[events_dict[formatted_curr_date][0].get(j.toString()).fields.trainer] + "<br />" +
							 levels[events_dict[formatted_curr_date][0].get(j.toString()).fields.level] + "<br />" +
							 "</div>"
						);
						
						events_flag = true;
					} 
				}
				if(classes_this_week.length > 0) {
					var class_str = "";
					for(var i_cls = 0; i_cls < classes_this_week.length; i_cls++){
						if((classes_this_week[i_cls].fields.days).includes(i + 1)) {
							
							if(classes_this_week[i_cls].fields.time == j.toString()) {
								if(events_flag == false) {
									/*
									$dayElement.find(".timeSlots").append(
									"<div id='"+ (j-8) +"' class='timeevents'>");
									*/
									class_str = "<div id='"+ (j-8) +"' class='timeevents'>";
								} else {
									//$dayElement.find(".timeSlots").append("--------");
									class_str = "--------";
								}
								/*
								$dayElement.find(".timeSlots").append(
									 "Class Name: "+ classes_this_week[i_cls].fields.name + "<br />" +
									 "Trainer: " + classes_this_week[i_cls].fields.trainer + "<br />" +
									 "Level: " + classes_this_week[i_cls].fields.level + "<br />"
								);
								*/
								class_str += classes_this_week[i_cls].fields.name + "<br />" +
									 users[classes_this_week[i_cls].fields.trainer] + "<br />" +
									 levels[classes_this_week[i_cls].fields.level] + "<br />"
								class_flag = true;
							}
							
						}
					}
					class_str += "</div>";
					//$dayElement.find(".timeSlots").append("</div>");
					$dayElement.find(".timeSlots").append(class_str);
				}
				
				if(events_flag == false && class_flag == false) {			
					$dayElement.find(".timeSlots").append(
						"<div id='"+ (j-8) +"' class='time'>" + 
							"No events" +
						"</div>"
					);
				}
			} else {			
				$dayElement.find(".timeSlots").append(
					"<div id='"+ (j-8) +"' class='time'>" + 
						"No events" +
					"</div>"
				);
			}
        }
        console.log("---------__");
        $(".dayElementContainer").append($dayElement);
        /*
        if(firstDay+i==dayToday){
            $dayElement.addClass('active');
        }
        */
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

    //return [nextWeekMoment.isoWeek(),year];
	return [nextWeekMoment.isoWeek(),nextWeekMoment.isoWeekYear()];
};

var events_dict = {};
var classes_dict = {};


$(document).ready(function(){
    /*
    var date = new Date();
    var year = date.getFullYear(); //year eg, 2016
    //var month = date.getMonth() + 1; // month eg, 11
    var week = date.getWeek();
    //var day = date.getDate();       //day eg. 21
    //var weekDay = date.getDayOfWeek();    //day of the week eg. 1. (monday)
    //var firstDay = getDateRangeOfWeek(week)[0];
    //console.log("Date = " + year +", " + month +", " + day + ". Day num = " + weekDay);
    //console.log("Week starts with: " + getDateRangeOfWeek(week));


    var dateToday = new Date();
    var dt = new Date();
    var daysFromMonday = ((dateToday.getDate() || 6)+1);
    var mondayDate = dateToday.getDate() - daysFromMonday;

    console.log("mondayDate="+mondayDate);

    mondayDate = (dt.setDate(date.getDate()-7)) -daysFromMonday;
    console.log("mondayDate last week="+mondayDate);
*/


    //MOMENTMOMENTMOMENTMOMENTMOMENTMOMENTMOMOENTM

    console.log("DB_EVENTS:");
    console.log(db_events);
    console.log("\nDB_CLASSES:");
    console.log(db_classes);
	var m;
    for (var i = 0 ; i < db_events.length ; i++){
        //console.log(db_events[i].fields.date);
		if(!events_dict[db_events[i].fields.date]) {
			m = new Map();
			events_dict[db_events[i].fields.date] = [];
			events_dict[db_events[i].fields.date].push(m.set(db_events[i].fields.time, db_events[i]));
		} else {
			m = events_dict[db_events[i].fields.date][0];
			m.set(db_events[i].fields.time, db_events[i]);
		}
		
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

    console.log(typeof(mweek));


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
        // week-=1;
        // if (week < 1){
        //     week = 52;
        //     year-=1;
        // }
		/*
        if (mweek==1){
            myear-=1;
        }
		*/
        var ar = addDatesToCalendar(mweek,myear, "prev");
        mweek = ar[0] ;
        myear = ar[1];
    });
    $(".next").click(function(){
        console.log("clicked NEXT!");
        // week+=1;
        // if (week> 52){
        //     week = 1;
        //     year+=1;
        // }
		/*
        if (mweek==52){
            myear+=1;
        }
		*/
        var ar = addDatesToCalendar(mweek,myear, "next");
        mweek = ar[0];
        myear = ar[1];
    });

});
