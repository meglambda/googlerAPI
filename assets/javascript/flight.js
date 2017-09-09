
$(document).ready(function(){
  
var destinationCity = '';

$("#eventCarousel").hide();

function clearEvents(){
	$("#eventItems").empty();
		$("#location").html('');
		$("#weather-table > tbody").empty();
}
$("#submit").on("click", function(){
				event.preventDefault();
				clearEvents();
				console.log("submit button works?");
				destinationCity = $("#location").val().trim();
				console.log(destinationCity);

	findForecast(destinationCity, function(date, temperaturemin, temperatureMax, weather, humidity){
		// $("forecast-table").removeChild()
		$("#forecast-table").append("<tr><td>" + date + "</td><td>" + temperaturemin  + "</td><td>" + temperatureMax + "</td><td>" + weather +  "</td><td>" + humidity + "</td></tr>")
	});

	findWeatherInCity(destinationCity, function(temperature) {
	
	$("#weather-table > tbody").append("<tr><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
	events(destinationCity, function() {
	console.log(destinationCity);
	$("#eventItems").append("<div class='item active'><a href="+eventPageUrl+"><img src="+imgUrl+
		"><div class='carousel-caption'><h3>"+eventName+"</h3><p>"+eventDate+"</p></div></a></div>");
	});
	$("#cityEvents").html('Here are some events in '+ destinationCity);
});

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
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======


>>>>>>> 43a743b5dafc2512b8c9a1bf5cfac33da2860015
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
// eventbrite api call function//https://www.eventbriteapi.com/v3/events/search/q=denver?token=MOX2TZYUBRDINF24GULS
//https://www.eventbriteapi.com/v3/events/search/?location.address=denver&token=MOX2TZYUBRDINF24GULS
//&expand=event.venue
<<<<<<< HEAD
>>>>>>> 2cb78dbf2732efd06b6487e6205942226687e86c
=======

>>>>>>> 43a743b5dafc2512b8c9a1bf5cfac33da2860015
function events (destinationCity) {
	var APIKey = "MOX2TZYUBRDINF24GULS";
	console.log(destinationCity);

	console.log(destinationCity);
	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?location.address="+destinationCity+"&token=MOX2TZYUBRDINF24GULS";
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
