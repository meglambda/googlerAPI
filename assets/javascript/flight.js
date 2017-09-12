
$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCD8EukaLgNVNPIkNXBvK7lUY7t9AyEU0w",
    authDomain: "firstfirebase-58100.firebaseapp.com",
    databaseURL: "https://firstfirebase-58100.firebaseio.com",
    projectId: "firstfirebase-58100",
    storageBucket: "firstfirebase-58100.appspot.com",
    messagingSenderId: "706998340569"
  };
  firebase.initializeApp(config);
  	  db = firebase.database();
// configration for slid photo's
	var destinationCity= '';
    var width = 2000;
    var animationSpeed = 10;
    var pause = 7000;
    var currentSlide = 0;
   	var $slider = $('#slider');
    var $slideContainer = $slider.find('.slides');
    var $slides = $slideContainer.find('.slide');
   	var interval;
   	var userInputReceived = 0;
 // start slidingright to left
function startSlider(){
   interval =  setInterval (function() {  
     $slideContainer.animate({'margin-left': '-='+ width}, animationSpeed, function(){
     currentSlide++;
     if (currentSlide === $slides.length){
          currentSlide = 1;//
          $slideContainer.css('margin-left', 0);
        }
       });
   }, pause);
}
 function stopSlider(){
    clearInterval(interval);
   }
  // slider stops when mouse move to the sliding area
 $slider.on('mouseenter', stopSlider).on('mouseleave', startSlider);
// startSlider();
function placesSearch(){
	var input = $("#location").html();
	var autocomplete = new google.maps.places.Autocomplete(input);
}
function clearEvents(){
	$("#eventItems").empty();
	$("#forecast-table").empty();
	$("#weather-table").empty();
	console.log('clear events executed');
}
  //function that will call the weather api given the insert it into the query 
function findWeatherInCity (destinationCity, callback) {
	var APIKey = "166a433c57516f51dfab1f7edaed8413";
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + destinationCity + "&appid=" + APIKey;
	console.log('@ findWeatherInCity func '+queryURL);
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log(response);
		console.log(response.main.temp);
		iconUrl = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
		 	console.log(iconUrl);
		var temperatureLatest = kelvinToF( response.main.temp);
		callback(temperatureLatest);
		function kelvinToF (k) {
	        return Math.round((k-273.15)*1.80 +32,0);
	      }
	});
} 
function findForecast (destinationCity, callback) {
	var APIKey = "166a433c57516f51dfab1f7edaed8413";
	// var location = $(destinationLatest).attr("data-location");
	var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + destinationCity + "&appid=" + APIKey;
$.ajax({
	url: queryURL,
	method: "GET"
})
.done(function(response){
	var results = response.data;
	// for(var = 0; i < 100; i++) {
	// console.log("tempMax day 2" + response.list[0].main.temp.max);
			// console.log("did this work?:" + response.list[0].main.temp_max);
			// console.log("did this work?:" + response.list[0].main.temp_min);
			// console.log("date is:" + response.list[0].dt_txt);
			// console.log("weather is: " + response.list[0].weather[0].description);
// var currentTime = moment().format("YYYY:MM:DD");
// console.log("the current date is:" + currentTime);
	// let today = moment(new Date()).format("YYYY:MM:DD")
	// console.log("today's dates" + today);
	// let tomorrow = moment(new Date()).add(1, 'days').format("YYYY:MM:DD");
	// console.log("tomorrow's date" + tomorrow);
console.log('@ findForecast func '+response);
var extededForecast = response.list;
for (var i=0; i< extededForecast.length ; i+=8){
				var temperatureLatestMin = Math.round(kelvinToF(extededForecast[i].main.temp_min));
				var temperatureLatestMax = Math.round(kelvinToF(extededForecast[i].main.temp_min));
				var weather = extededForecast[i].weather[0].description; 
				var humidity = extededForecast[i].main.humidity;
				var date = extededForecast[i].dt_txt;
				date = moment(date).format("LL");
				callback(date, temperatureLatestMin, temperatureLatestMax, weather, humidity);
					function kelvinToF (k) {
	        return Math.round((k-273.15)*1.80 +32,0);
	      }		
		}
});
}
 //slickThings function applies the carousel functionality to the events displayed in the DOM
function slickThings() {	
	console.log("@slick executed!!!");
	$('#eventItems').slick({
	infinite: true,
  	slidesToShow: 4,
	variableWidth: true,
  	slidesToScroll: 2,
  	prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
    nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
  	autoplay: true,
  	autoplaySpeed: 5000,
  	responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
		});
}
//Eventbrite api call function//https://www.eventbriteapi.com/v3/events/search/q=denver?token=MOX2TZYUBRDINF24GULS
//https://www.eventbriteapi.com/v3/events/search/?location.address=denver&token=MOX2TZYUBRDINF24GULS
//&expand=event.venue
function events (destinationCity) {
	console.log('@ events func '+destinationCity);
	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?location.address="+destinationCity+"&token=MOX2TZYUBRDINF24GULS";
	console.log('@ events func '+queryURL);
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log('@ events func '+response);
	  var eventsList = response.events.slice(0,7);

		for (var i = 0; i < eventsList.length; i++) {
		var eventName = eventsList[i].name.text;
		//truncate event name that exceeds 60 char.
		eventName = jQuery.trim(eventName).substring(0,60).split(" ").slice(0,-1).join(" ")+ "...";
		var eventPageUrl = eventsList[i].url;
		var imgUrl = eventsList[i].logo.url;
		var eventDate = eventsList[i].start.local;
		eventDate = moment(eventDate).format('MMMM, DD YYYY');	
		// $("#eventCarousel").show();
		$("#eventItems").append("<div style='margin: 1px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-center text-info' style='margin: 1px;'>"+eventName+
				" <br> <span class='text-muted text-center'>"+eventDate+"</span></h6></div></a></div> ");
		
		}	slickThings();	

    //The following is model to alert user of any incorrect input provided
	}).fail(function(){
        var message = "You did not type in a correct city. Please type in a correct city";
        $("#alertModal").find(".modal-body p").text(message);
        $("#alertModal").modal("show");
        // clearEvents();
    });		
}

  //A function to call all APIs outside of the click event
function callAllApis(destinationCity){
	events(destinationCity, function() {
	console.log(destinationCity);
	$("#eventItems").append("<div style='margin: 1px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-center text-info' style='margin: 1px;'>"+eventName+" <br> <span class='text-muted text-center'>"+eventDate+"</span></h6></div></a></div> ");
		// slickThings();	
	});	
	clearEvents();
		console.log('all APis call executed');
	findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<th><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></th>" );
});
	findForecast(destinationCity, function(date, temperaturemin, temperatureMax, weather, humidity){
	// $("#forecast-table").empty();
	$("#forecast-table").append("<tr><td>" + date + "</td><td>" + temperaturemin  + "</td><td>" + temperatureMax + "</td><td>" + weather +  "</td><td>" + humidity + "</td></tr>");
});
	$("#location").val('');	
	
	// clearEvents();
}
  //this block takes the users's input, assigns it a variable and stores it in Firebase//
$("#submit").on("click", function(){
	event.preventDefault();
	// clearEvents();
	userInputReceived = 1;
	sessionStorage.setItem('userInputReceived',0);
	console.log($("#location").val());

	destinationCity = $("#location").val().trim();
	//making the first letter of each word uppercase.
	destinationCity = destinationCity.toLowerCase().replace(/\b[a-z]/g, function(letter){
		return letter.toUpperCase();
	});

		db.ref().set({
			destinationCity: destinationCity,
		});
	// onLoad();	
	sessionStorage.setItem('userInputReceived',userInputReceived);
	// console.log(sessionStorage.getItem('userInputReceived'));
	// console.log(userInputReceived);
	// slickThings();
		$("#location").val('');	

}); 
//on page reload, this block is to load data based on last location searched by the user or the location provided by the ip-api in the case a search hasn't been recorded//

if(sessionStorage.getItem('userInputReceived') !== '1') {
	geolocate();
	console.log(userInputReceived);
	console.log(sessionStorage.getItem('userInputReceived'));
	} else {
		console.log('ready to retrieve stored location');
	db.ref().on("value",function(snapshot){
		console.log('@ load func '+snapshot.val().destinationCity);
		destinationCity = snapshot.val().destinationCity;
		callAllApis(destinationCity);
	},function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
	}

//calling the ip-api to get a general idea of user location which is then used to call the events & weather APIs to prepopulate the page on load
 function geolocate(destinationCity) {
 queryURL = 'https://ip-api.com/json';
 $.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		console.log(response.city);
		destinationCity = response.city;
	console.log('onLoad executed');
	console.log('@geoLocate location is '+destinationCity);
   //calling apis
   callAllApis(destinationCity);
});		
}

});
//608413c8703a4a14bd84f822380aa48b   api key for news
//print it to the screen
