 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAiXRYAkF37tDP8ZdsCXAV4Hp2ysnyxzKE",
    authDomain: "trialairline.firebaseapp.com",
    databaseURL: "https://trialairline.firebaseio.com",
    projectId: "trialairline",
    storageBucket: "trialairline.appspot.com",
    messagingSenderId: "165337648944"
  };
  firebase.initializeApp(config);

  	var database = firebase.database();
$("#submit").on("click", function(){
	event.preventDefault();
	console.log("submit button works?");
	var destinationCity = $("#arrivalDestination").val().trim();
	console.log("destination city is" + destinationCity);
	var arrivalDate = $("#arrivalDate").val().trim();
	console.log("arrivalDate is: " + arrivalDate);
	var departureDate = $("#departureDate").val().trim();
	console.log("departureDate is: " + departureDate); 

	var empObj = {
		destination: destinationCity,
		dateOfArrival: arrivalDate,
		dateOfDeparture: departureDate



	};
	database.ref().push({
		empObj
	});
});

database.ref().on("child_added", function(snapshot, prevChildKey){
	var empObj = snapshot.val().empObj;

	console.log(empObj);

	var destinationLatest = empObj.destination;
	var arrivalDateLatest = empObj.dateOfArrival;
	var departureDateLatest = empObj.dateOfDeparture;

	findWeatherInCity(destinationLatest, function(temperature){

		console.log(destinationLatest, arrivalDateLatest, departureDateLatest);
	$("#weather-table > tbody").append("<tr><td>" + destinationLatest + "</td><td>" + temperature + "</td></tr>" )
 
	});

	
});

function findWeatherInCity (destinationCity, callback) {
	var APIKey = "166a433c57516f51dfab1f7edaed8413";
	// var location = $(destinationLatest).attr("data-location");
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + destinationCity + "&appid=" + APIKey;

$.ajax({
	url: queryURL,
	method: "GET"
})
.done(function(response){

	var results = response.data;
	console.log(response.main.temp);
	var temperatureLatest = kelvinToF( response.main.temp);
	callback(temperatureLatest)


function kelvinToF (k) {
        return (k-273.15)*1.80 +32;

      }

});

} 

//function that will call the weather api given the insert it into the query 
//return the forcast and store in value
//store that value in firebase 
//print it to the screen
