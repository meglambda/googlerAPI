
$(document).ready(function(){

	 //  var config = {
  //   apiKey: "AIzaSyCD8EukaLgNVNPIkNXBvK7lUY7t9AyEU0w",
  //   authDomain: "firstfirebase-58100.firebaseapp.com",
  //   databaseURL: "https://firstfirebase-58100.firebaseio.com",
  //   projectId: "firstfirebase-58100",
  //   storageBucket: "firstfirebase-58100.appspot.com",
  //   messagingSenderId: "706998340569"
  // };
  // firebase.initializeApp(config);
  // 	  db = firebase.database();

	var destinationCity= '';
// function slickThings() {
// // if($('#eventItems').find("div"))	
// 	console.log("@slick executed!!!");
// 	$('.eventItems').slick({
// 	infinite: true,
//   	slidesToShow: 4,
// 	variableWidth: true,
//   	slidesToScroll: 4,
//   	// prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
//    //  nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
//   	autoplay: true
// 		});
// } 
   function getSlickSettings() {
    	return{
    		infinite: true,
  	slidesToShow: 4,
	variableWidth: true,
  	slidesToScroll: 4,
  	// prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
   //  nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
  	autoplay: true
    	};
    }
     // $(".eventItems").slick(getSlickSettings);

	function events (destinationCity) {
			// $(".eventItems").slick('unslick');

	console.log('@ events func '+destinationCity);
	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?location.address="+destinationCity+"&token=MOX2TZYUBRDINF24GULS";
	console.log('@ events func '+queryURL);

	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log(response);
	  	var eventsList = response.events;
		for (var i = 0; i < 8; i++) {
		var eventName = eventsList[i].name.text;
		//truncate event name that exceeds 60 char.
		// eventName = jQuery.trim(eventName).substring(0,60).split("").slice(0,-1).join("")+ "...";
		var eventPageUrl = eventsList[i].url;
		var eventDate = eventsList[i].start.local;
		eventDate = moment(eventDate).format('MMMM, DD YYYY');
		var imgUrl = eventsList[i].logo.url;
		// callback(eventPageUrl,imgUrl,eventName,eventDate);
		// $("#eventItems").hide();
		$(".eventItems").append("<div style='margin: 1px;'><a href="+eventPageUrl+
			" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-center text-info' style='margin: 1px;'>"+eventName+
				"<br><span class='text-muted text-center'>"+eventDate+"</span></h6></div></a></div>");
		}	 	
		$(".eventItems").slick(getSlickSettings);

		// slickThings();			  				// $("#eventItems").show();
	// setTimeout(slickThings,11); 
	});

    }

 
    //The following is model to alert user of any incorrect input provided	
function clearEvents(){
	$(".eventItems").empty();
	// $("#forecast-table").empty();
	// $("#weather-table").empty();
	console.log('clear events executed');
}
$("#submit").on("click", function(){
	// $("#eventItems").slick('unslick');
	event.preventDefault();
	clearEvents();
		destinationCity = $("#location").val().trim();
	
	userInputReceived = 1;
	sessionStorage.setItem('userInputReceived',0);
		console.log('user input ' +destinationCity);
	//making the first letter of each word uppercase.
	destinationCity = destinationCity.toLowerCase().replace(/\b[a-z]/g, function(letter){
		return letter.toUpperCase();
	});
	// db.ref().set({
	// 	destinationCity: destinationCity,
	// });	
	sessionStorage.setItem('userInputReceived',userInputReceived);
	$("#location").val('');	

 events(destinationCity);
}); 


});

