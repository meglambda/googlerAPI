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
function events (destinationCity) {
	console.log('events executed');
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

	}).fail(function(){
        var message = "You did not type in a correct city. Please type in a correct city";
        $("#alertModal").find(".modal-body p").text(message);
        $("#alertModal").modal("show");
        clearEvents();
    });

}
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
function callBothAllApis(destinationCity){

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
if(userInputReceived == 0) {
	console.log(userInputReceived);
	console.log(localStorage.getItem('userInputReceived'));
		geolocate();
	} else {
		console.log(userInputReceived);
		db.ref().on('value',function(snapshot){
		console.log(snapshot.destinationCity);
		destinationCity = snapshot.destinationCity;
		callBothAllApis(destinationCity);
});
		geolocate(destinationCity);
	}
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
	localStorage.setItem('userInputReceived',userInputReceived);
console.log(localStorage.getItem('userInputReceived'));
console.log(userInputReceived);
});

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
	events(destinationCity, function() {
	console.log(destinationCity);
	$("#eventItems").append("<div style='margin: 5px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 5px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
	});
	findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<tr><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
});		
}

});

//function that will call the weather api given the insert it into the query 
//return the forcast and store in value
//store that value in firebase 
//print it to the screen