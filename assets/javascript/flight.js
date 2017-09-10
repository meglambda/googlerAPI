
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
  
// configration for slid photo's
	var destinationCity= '';
    var width = 720;
    var animationSpeed = 1000;
    var pause = 3000;
    var currentSlide=1;
   	var $slider = $('#slider');
    var $slideContainer = $slider.find('.slides');
    var $slides = $slideContainer.find('.slide');
   	var interval;
   	var userInputReceived = 0;
//define database, db
	  db =firebase.database();
  // start slidingright to left
function startSlider(){
   interval =  setInterval (function() {  
     $slideContainer.animate({'margin-left': '-=' +width}, animationSpeed, function(){
     currentSlide++;
     if (currentSlide===$slides.length){
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
	startSlider();

function placesSearch(){
	var input = $("location").html();
	var autocomplete = new google.maps.places.Autocomplete(input);
}
function clearEvents(){
	$("#eventItems").empty();
	$("#weather-table").empty();
	console.log('clear events executed');
}
  //function that will call the weather api given the insert it into the query 
function findWeatherInCity (destinationCity, callback) {
	var APIKey = "166a433c57516f51dfab1f7edaed8413";
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + destinationCity + "&appid=" + APIKey;
	console.log(queryURL);
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
	var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + destinationCity + "&appid=" + APIKey;
$.ajax({
	url: queryURL,
	method: "GET"
})
.done(function(response){
	var results = response.data;
	// for(var = 0; i < 100; i++) {
	// console.log("tempMax day 2" + response.list[0].main.temp.max);
	console.log("did this work?:" + response.list[0].main.temp_max);
	console.log("did this work?:" + response.list[0].main.temp_min);
	console.log("date is:" + response.list[0].dt_txt);
	console.log("weather is: " + response.list[0].weather[0].description);
// var currentTime = moment().format("YYYY:MM:DD");
// console.log("the current date is:" + currentTime);
	// let today = moment(new Date()).format("YYYY:MM:DD")
	// console.log("today's dates" + today);
	// let tomorrow = moment(new Date()).add(1, 'days').format("YYYY:MM:DD");
	// console.log("tomorrow's date" + tomorrow);
console.log(response);
for (var i=0; i<132 ; i+=8){
				var temperatureLatestMin = Math.round(kelvinToF (response.list[i].main.temp_min));
				var temperatureLatestMax = Math.round(kelvinToF(response.list[i].main.temp_min));
				var weather = response.list[i].weather[0].description; 
				var humidity = response.list[i].main.humidity;
				var date = response.list[i].dt_txt;
				date = moment(date).format("LL");
				callback(date, temperatureLatestMin, temperatureLatestMax, weather, humidity);
					function kelvinToF (k) {
	        return Math.round((k-273.15)*1.80 +32,0);
	      }		
		}
})
}
//Eventbrite api call function//https://www.eventbriteapi.com/v3/events/search/q=denver?token=MOX2TZYUBRDINF24GULS
//https://www.eventbriteapi.com/v3/events/search/?location.address=denver&token=MOX2TZYUBRDINF24GULS
//&expand=event.venue
function events (destinationCity) {
	console.log(destinationCity);
	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?location.address="+destinationCity+"&token=MOX2TZYUBRDINF24GULS";
	console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log(response.events.slice(0,8));
	  var eventsList = response.events.slice(0,8);
		for (var i = 0; i < eventsList.length; i++) {
		var eventName = eventsList[i].name.text;
		var eventPageUrl = eventsList[i].url;
		var eventDate = eventsList[i].start.local;
		eventDate = moment(eventDate).format('MMMM, DD YYYY');	
		var imgUrl = eventsList[i].logo.url;
		$("#cityEvents").html('Here are some events in '+ destinationCity);
		// $("#eventCarousel").show();
		$("#eventItems").append("<div style='margin: 5px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 5px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
		}
		slickThings();
    //The following is model to alert user of any incorrect input provided
	}).fail(function(){
        var message = "You did not type in a correct city. Please type in a correct city";
        $("#alertModal").find(".modal-body p").text(message);
        $("#alertModal").modal("show");
        clearEvents();
    });

}
  //slickThings function applies the carousel functionality to the events displayed in the DOM
function slickThings() {	
	console.log("slick executed!!!");
	$('#eventItems').slick({
	infinite: true,
  	slidesToShow: 4,
	variableWidth: true,
  	slidesToScroll: 2,
  	prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
    nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
  	autoplay: true,
  	autoplaySpeed: 3000,
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
  //A function to call all APIs outside of the click event
function callAllApis(destinationCity){
findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<tr><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
	events(destinationCity, function() {
	console.log(destinationCity);
	$("#eventItems").append("<div style='margin: 5px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 5px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
	});
	$("#location").val('');		
	clearEvents();

}
  //on page reload, this block is to load data based on last location searched by the user or the location provided by the ip-api in the case a search hasn't been recorded//
if(userInputReceived == 0) {
	console.log(userInputReceived);
	console.log(localStorage.getItem('userInputReceived'));
		geolocate();
	} else {
		console.log(userInputReceived);
		db.ref().on('value',function(snapshot){
		console.log(snapshot.destinationCity);
		destinationCity = snapshot.destinationCity;
		callAllApis(destinationCity);
});
		geolocate(destinationCity);
	}
  //this block takes the users's input, assigns it a variable and stores it in Firebase//
$("#submit").on("click", function(){
	userInputReceived = 1;
	localStorage.setItem('userInputReceived',0);
	event.preventDefault();
	console.log($("#location").val());
	destinationCity = $("#location").val().trim();
	console.log(destinationCity);
db.ref().set({
	destinationCity: destinationCity,
});
  	findForecast(destinationCity, function(date, temperaturemin, temperatureMax, weather, humidity){
		// $("forecast-table").removeChild()
		$("#forecast-table").append("<tr><td>" + date + "</td><td>" + temperaturemin  + "</td><td>" + temperatureMax + "</td><td>" + weather +  "</td><td>" + humidity + "</td></tr>")
	});
//call weather function & update DOM with returned data
	findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<tr><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
  //call events function & update DOM with returned data
	events(destinationCity, function() {
	console.log(destinationCity);
	$("#eventItems").append("<div style='margin: 5px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 5px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
	});
	$("#location").val('');		
	clearEvents();
	localStorage.setItem('userInputReceived',userInputReceived);
console.log(localStorage.getItem('userInputReceived'));
console.log(userInputReceived);
});
//calling the ip-api to get a general idea of user location which is then used to call the events & weather APIs to prepopulate the page on load
 function geolocate(destinationCity) {
 queryURL = 'http://ip-api.com/json';
 $.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		console.log(response.city);
		destinationCity = response.city;
	console.log('onLoad executed');
	console.log(destinationCity);
   //calling events
	events(destinationCity, function() {
	console.log(destinationCity);
	$("#eventItems").append("<div style='margin: 5px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 5px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
	});
   //calling weather api
	findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<tr><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
});		
}

});

//print it to the screen
