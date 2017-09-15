
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

function clearEvents(){
	$("#eventItems").empty();
	$("#forecast-table").empty();
	$("#weather-table").empty();
	console.log('clear events executed');
}


// //on page reload, this block is to load data based on last location searched by the user or the location provided by the ip-api in the case a search hasn't been recorded//
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
 queryURL = 'https://geoip.nekudo.com/api/';
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		console.log(response.city);
		destinationCity = response.city;
	console.log('@geoLocate location is '+destinationCity);
   callAllApis(destinationCity);
	});		
	}
// ,callback
function events (destinationCity) {
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
		for (var i = 0; i < 11; i++) {
		var eventName = eventsList[i].name.text;
		// truncate event name that exceeds 60 char.
		eventName = jQuery.trim(eventName).substring(0,60).split("").slice(0,-1).join("")+ "...";
		var eventPageUrl = eventsList[i].url;
		var eventDate = eventsList[i].start.local;
		eventDate = moment(eventDate).format('MMMM, DD YYYY');
		var imgUrl = eventsList[i].logo.url;
		// callback(eventPageUrl,imgUrl,eventName,eventDate);
		$("#eventItems").append("<div eventSlide style='margin: 1px;'><a href="+eventPageUrl+
			" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-center text-info' style='margin: 1px;'>"+eventName+
				"<br><span class='text-muted text-center'>"+eventDate+"</span></h6></div></a></div>");
		}	
		$("#eventItems").slick(slickingAround());
		// slickThings();    		
    //The following is model to alert user of any incorrect input provided
	}).fail(function(){
        var message = "You did not type in a correct city. Please type in a correct city";
        $("#alertModal").find(".modal-body p").text(message);
        $("#alertModal").modal("show");
        // clearEvents();
    });		
}
  //function to call the weather api
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
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + destinationCity + "&appid=" + APIKey;
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log(response);
		var results = response.data;
	var extededForecast = response.list;
	for (var i=0; i< extededForecast.length ; i+=8){
					// var temperatureLatestMin = Math.round(kelvinToF(extededForecast[i].main.temp_min));
					var temperatureLatestMax = Math.round(kelvinToF(extededForecast[i].main.temp_min));
					var weatherIcon = "https://openweathermap.org/img/w/" + extededForecast[i].weather[0].icon + ".png";
					// var weather = extededForecast[i].weather[0].description; 
					var humidity = extededForecast[i].main.humidity;
					var date = extededForecast[i].dt_txt;
					date = moment(date).format("ddd");
					callback(date, temperatureLatestMax,weatherIcon, humidity);
						function kelvinToF (k) {
		        return Math.round((k-273.15)*1.80 +32,0);
		      }		
		}
	});
}

  //A function to call all APIs outside of the click event
function callAllApis(destinationCity,callback){		
	console.log(destinationCity);
	events(destinationCity,function(eventPageUrl,imgUrl,eventName,eventDate) {
	});				
	console.log('all APis call executed');
	findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<span style='margin: 4px;'>" + destinationCity + 
		"</span><span style='margin-right: 44px;'>" + temperature + " &#8457"+ "<img src="+iconUrl+
		"></span><button id='fiveDay' data-toggle='collapse'>"+'5 Day Forcast'+"</button><div id='fiveDayWeather'></div>");
	});
	findForecast(destinationCity, function(date, temperatureMax,weatherIcon, humidity){
	$("#fiveDayWeather").append(" <div style='display: inline-block;' class='fiveDaySpan'><td class='text-left'>  " + date + "  </td><td> " + 
		temperatureMax + " &#8457 "+ " <img src=" +weatherIcon + " | ></td></div>");
	$("#fiveDayWeather").hide();	
});	
}	
  //this block takes the users's input, assigns it a variable and stores it in Firebase//
$("#submit").on("click", function(){

	if ($("#location").val().length < 1 || $("#location").val().trim() === '') {
		 var message = "You did not type in a correct city. Please type in a correct city";
        $("#alertModal").find(".modal-body p").text(message);
        $("#alertModal").modal("show");	
        console.log('pooop');

	} else {
	destinationCity = $("#location").val().trim();
	userInputReceived = 1;
	sessionStorage.setItem('userInputReceived',0);
	console.log('user input ' +destinationCity);
	//making the first letter of each word uppercase.
	destinationCity = destinationCity.toLowerCase().replace(/\b[a-z]/g, function(letter){
		return letter.toUpperCase();
	});
	db.ref().set({
		destinationCity: destinationCity,
	});	
	sessionStorage.setItem('userInputReceived',userInputReceived);
	$("#location").val('');	
  	}
}); 
$(document).on("click", "#fiveDay", function(){
	// event.preventDefault(); page must refresh for slick to apply on click
	$("#fiveDayWeather").empty();
	findForecast(destinationCity, function(date, temperatureMax,weatherIcon, humidity){
	$("#fiveDayWeather").append(" <div style='display: inline-block;' class='fiveDaySpan'><td class='text-left'>  " + date + "  </td><td> " + 
		temperatureMax + " &#8457 "+ " <img src=" +weatherIcon + " | ></td></div>");
	});	
	$("#fiveDayWeather").toggle();
}); 
 

// slickThings function applies the carousel functionality to the events displayed in the DOM

function slickingAround() {
	return{
	infinite: true,
  	slidesToShow: 4,
	variableWidth: true,
  	slidesToScroll: 1,
  	prevArrow: false, 
    nextArrow: false,
  	autoplay: true,
  	autoplaySpeed: 5000,
  	responsive: [
    {
      breakpoint: 1025,
      settings: { 
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 319,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
  ]
	};

  }

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
startSlider();
});
