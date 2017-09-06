// Initialize Firebase
$(document).ready(function(){
  // var config = {
  //   apiKey: "AIzaSyAiXRYAkF37tDP8ZdsCXAV4Hp2ysnyxzKE",
  //   authDomain: "trialairline.firebaseapp.com",
  //   databaseURL: "https://trialairline.firebaseio.com",
  //   projectId: "trialairline",
  //   storageBucket: "trialairline.appspot.com",
  //   messagingSenderId: "165337648944"
  // };
   var config = {
    apiKey: "AIzaSyCD8EukaLgNVNPIkNXBvK7lUY7t9AyEU0w",
    authDomain: "firstfirebase-58100.firebaseapp.com",
    databaseURL: "https://firstfirebase-58100.firebaseio.com",
    projectId: "firstfirebase-58100",
    storageBucket: "firstfirebase-58100.appspot.com",
    messagingSenderId: "706998340569"
  };
firebase.initializeApp(config);
// var	iconUrl=""; 
var database = firebase.database();
var destinationCity = '';
var destinationLatest = '';
$("#eventCarousel").hide();
var locationObj = {
		destination: destinationCity
		// dateAdded: firebase.database.ServerValue.TIMESTAMP
	};
	database.ref().push({
		dateAdded: firebase.database.ServerValue.TIMESTAMP,
		locationObj
	});
function clearEvents(){
	$("#eventItems").empty();
}
$("#submit").on("click", function(){
	event.preventDefault();
	clearEvents();
	console.log("submit button works?");
	destinationCity = $("#location").val().trim();
	// events(destinationCity);
	console.log(destinationCity);
	locationObj = {
		destination: destinationCity
		// dateAdded: firebase.database.ServerValue.TIMESTAMP
	};
	database.ref().push({
		dateAdded: firebase.database.ServerValue.TIMESTAMP,
		locationObj
	});
	$("#location").html('');
});
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
 	locationObj = snapshot.val();
	console.log(locationObj);
	if(destinationLatest == ''){
		destinationLatest = 'Denver';
				console.log(destinationLatest);
		$("#cityEvents").html('Here are some events in '+ destinationLatest);
	}
	// var destinationLatest = locationObj.locationObj.destination;
	findWeatherInCity(destinationLatest, function(temperature) {
	console.log(destinationLatest +" "+ iconUrl);
	$("#weather-table > tbody").append("<tr><td>" + destinationLatest + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
	events(destinationLatest, function() {
	console.log(destinationLatest);
	$("#eventItems").append("<div class='item active'><a href="+eventPageUrl+"><img src="+imgUrl+
		"><div class='carousel-caption'><h3>"+eventName+"</h3><p>"+eventDate+"</p></div></a></div>");
	});
	$("#cityEvents").html('Here are some events in '+ destinationLatest);
});

function findWeatherInCity (destinationCity, callback) {
	var APIKey = "166a433c57516f51dfab1f7edaed8413";
	var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + destinationCity + "&appid=" + APIKey;
	console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log(response);
		console.log(response.main.temp);
		iconUrl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
		 	console.log(iconUrl);
		var temperatureLatest = kelvinToF( response.main.temp);
		callback(temperatureLatest);
		function kelvinToF (k) {
	        return Math.round((k-273.15)*1.80 +32,0);
	      }
	});
} 
// eventbrite api call function//https://www.eventbriteapi.com/v3/events/search/q=denver?token=MOX2TZYUBRDINF24GULS
//https://www.eventbriteapi.com/v3/events/search/?location.address=denver&token=MOX2TZYUBRDINF24GULS
//&expand=event.venue
function events (destinationLatest) {
	var APIKey = "MOX2TZYUBRDINF24GULS";
	console.log(destinationLatest);
	if(destinationLatest == ''){
		destinationLatest = 'Denver';
				console.log(destinationLatest);
		$("#cityEvents").html('Here are some events in '+ destinationLatest);
	}
	console.log(destinationLatest);
	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?location.address="+destinationLatest+"&token=MOX2TZYUBRDINF24GULS";
	console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		console.log(response.events.slice(0,6));
	var eventsList = response.events.slice(0,6);
		for (var i = 0; i < eventsList.length; i++) {
		var eventName = eventsList[i].name.text;
		var eventPageUrl = eventsList[i].url;
		var eventDate = eventsList[i].start.local;
		eventDate = moment(eventDate).format('MMMM, DD YYYY');	
		var imgUrl = eventsList[i].logo.url;
		// console.log('Logo Url is '+imgUrl);
		$("#eventCarousel").show();
				if(i <3){
					$("#eventItems").append("<div><div class='item active col-xs-4'><a href="+eventPageUrl+"target='_blank'><img src="+imgUrl+
				"><div class='carousel-caption'><h3>"+eventName+"</h3><p>"+eventDate+"</p></div></a></div><div>");
						} else if(i > 2) {
					$("eventItems").append("<div><div class='item'><a href="+eventPageUrl+"target='_blank'><img src="+imgUrl+
				"><div class='carousel-caption'><h3>"+eventName+"</h3><p>"+eventDate+"</p></div></a></div><div>");
				}
		}

	});
}
});
//function that will call the weather api given the insert it into the query 
//return the forcast and store in value
//store that value in firebase 
//print it to the screen