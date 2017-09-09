$(document).ready(function(){
  
function clearEvents(){
	$("#eventItems").empty();
	$("#location").html('');
		$("#weather-table > tbody").empty();
}
$("#submit").on("click", function(){
	event.preventDefault();
	clearEvents();
	console.log($("#location").val());
	destinationCity = $("#location").val().trim();
	console.log(destinationCity);
	findWeatherInCity(destinationCity, function(temperature) {
	$("#weather-table").append("<tr><td>" + destinationCity + 
		"</td><td>" + temperature + " &#8457"+ "<img src="+iconUrl+"></td></tr>" );
	});
	events(destinationCity, function() {
	console.log(destinationCity);

	$("#eventItems").append("<div style='margin: 11px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 11px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
		
});

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

function slickThings() {
	$('#eventItems').slick({
	infinite: true,
  	slidesToShow: 4,
	variableWidth: true,
  	slidesToScroll: 4,
  	prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
    nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
  	autoplay: true,
  	autoplaySpeed: 2000,
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
function events (destinationCity) {
	console.log(destinationCity);
// destinationCity = 'New York'; 
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
		$("#eventItems").append("<div style='margin: 11px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
				"><div><h6 class='text-muted text-info' style='margin: 11px;'>"+eventName+" | <span class='text-muted'>"+eventDate+"</span></h6></div></a></div> ");
		
		}
		slickThings();

	});
}

});
//function that will call the weather api given the insert it into the query 
//return the forcast and store in value
//store that value in firebase 
//print it to the screen