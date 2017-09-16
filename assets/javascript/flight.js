
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
	var placeSearched = '';
    var width = 2000;
    var animationSpeed = 10;
    var pause = 7000;
    var currentSlide = 0;
   	var $slider = $('#slider');
    var $slideContainer = $slider.find('.slides');
    var $slides = $slideContainer.find('.slide');
   	var interval;
   	var userInputReceived = 0;

		var map, places, infoWindow;
		      var markers = [];
		      var autocomplete;
		      var countryRestrict = {'country': 'us'};
		      var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
		      var hostnameRegexp = new RegExp('^https?://.+?/');

		      var countries = {
		       
		        'us': {
		          center: {lat: 15  , lng: 0},
		          zoom: 1
		        },
		        'all': {
		          center: {lat: 15  , lng: 0},
		          zoom: 1
		        },
		      
		      };
		      window.onload = function(){
		      	event.preventDefault();
		      	initMap ();
		      };

		      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: countries['us'].zoom,
          center: countries['us'].center,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          streetViewControl: false
        });

        infoWindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
        });

        // Create the autocomplete object and associate it with the UI input control.
        // Restrict the search to the default country, and to place type "cities".
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('autocomplete')), {
              types: ['(cities)'],
              componentRestrictions: countryRestrict
            });
        places = new google.maps.places.PlacesService(map);

        autocomplete.addListener('place_changed', onPlaceChanged);

        // Add a DOM event listener to react when the user selects a country.
        document.getElementById('country').addEventListener(
            'change', setAutocompleteCountry);
      }

      // When the user selects a city, get the place details for the city and
      // zoom the map in on the city.
      function onPlaceChanged() {
        var place = autocomplete.getPlace();

        console.log(place.name);
        placeSearched = place.name;
        console.log(placeSearched);
        // event.preventDefault();
				// db.ref().set({
				// placeSearched: placeSearched,
				// });
				callAllApis(placeSearched);
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(14);
          search();
        } else {
          document.getElementById('autocomplete').placeholder = 'Enter a city';
        }
      }

      // Search for hotels in the selected city, within the viewport of the map.
      function search() {
        var search = {
          bounds: map.getBounds(),
          types: ['lodging']
        };

        places.nearbySearch(search, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icon.
            for (var i = 0; i < 5; i++) {
              var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
              var markerIcon = MARKER_PATH + markerLetter + '.png';
              // Use marker animation to drop the icons incrementally on the map.
              markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
                // icon: markerIcon
              });
              // If the user clicks a hotel marker, show the details of that hotel
              // in an info window.
              markers[i].placeResult = results[i];
              google.maps.event.addListener(markers[i], 'click', showInfoWindow);
              setTimeout(dropMarker(i), i * 100);
              addResult(results[i], i);
            }
          }
        });
      }

      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i]) {
            markers[i].setMap(null);
          }
        }
        markers = [];
      }

      // Set the country restriction based on user input.
      // Also center and zoom the map on the given country.
      function setAutocompleteCountry() {
        var country = document.getElementById('country').value;
        if (country == 'all') {
          autocomplete.setComponentRestrictions({'country': []});
          map.setCenter({lat: 15, lng: 0});
          map.setZoom(2);
        } else {
          autocomplete.setComponentRestrictions({'country': country});
          map.setCenter(countries[country].center);
          map.setZoom(countries[country].zoom);
        }
        clearResults();
        clearMarkers();
      }

      function dropMarker(i) {
        return function() {
          markers[i].setMap(map);
        };
      }

      function addResult(result, i) {
        var results = document.getElementById('results');
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';

        var tr = document.createElement('tr');
        tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
        tr.onclick = function() {
          google.maps.event.trigger(markers[i], 'click');
        };

        var iconTd = document.createElement('td');
        var nameTd = document.createElement('td');
        var icon = document.createElement('img');
        icon.src = markerIcon;
        icon.setAttribute('class', 'placeIcon');
        icon.setAttribute('className', 'placeIcon');
        var name = document.createTextNode(result.name);
        iconTd.appendChild(icon);
        nameTd.appendChild(name);
        tr.appendChild(iconTd);
        tr.appendChild(nameTd);
        results.appendChild(tr);
      }

      function clearResults() {
        var results = document.getElementById('results');
        while (results.childNodes[0]) {
          results.removeChild(results.childNodes[0]);
        }
      }

      // Get the place details for a hotel. Show the information in an info window,
      // anchored on the marker for the hotel that the user selected.
      function showInfoWindow() {
        var marker = this;
        places.getDetails({placeId: marker.placeResult.place_id},
            function(place, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
              }
              infoWindow.open(map, marker);
              buildIWContent(place);
            });
      }

      // Load the place information into the HTML elements used by the info window.
      function buildIWContent(place) {
        document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
            'src="' + place.icon + '"/>';
        document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
            '">' + place.name + '</a></b>';
        document.getElementById('iw-address').textContent = place.vicinity;

       
        // The regexp isolates the first part of the URL (domain plus subdomain)
        // to give a short URL for displaying in the info window.
        if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').textContent = website;
        } else {
          document.getElementById('iw-website-row').style.display = 'none';
        }
      }


function clearEvents(){
	$("#eventItems").empty();
	$("#forecast-table").empty();
	$("#weather-table").empty();
	console.log('clear events executed');
}
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
calling the ip-api to get a general idea of user location which is then used to call the events & weather APIs to prepopulate the page on load
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

function events (placeSearched) {
	console.log('@ events func '+ placeSearched);
	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?location.address="+ placeSearched +"&token=MOX2TZYUBRDINF24GULS";
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
		// truncate event name that exceeds 60 char.
		eventName = jQuery.trim(eventName).substring(0,60).split("").slice(0,-1).join("")+ "...";
		var eventPageUrl = eventsList[i].url;
		var eventDate = eventsList[i].start.local;
		eventDate = moment(eventDate).format('MMMM, DD YYYY');
		var imgUrl = eventsList[i].logo.url;
	console.log('DONE!');		
		// callback(eventPageUrl,imgUrl,eventName,eventDate);
		$("#eventItems").append("<div style='margin: 1px;'><a href="+eventPageUrl+
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
  //function that will call the weather api given the insert it into the query 
function findWeatherInCity (placeSearched, callback) {
	var APIKey = "166a433c57516f51dfab1f7edaed8413";
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + placeSearched + "&appid=" + APIKey;
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
function findForecast (placeSearched, callback) {
var APIKey = "166a433c57516f51dfab1f7edaed8413";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + placeSearched + "&appid=" + APIKey;
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
					console.log(weatherIcon);
					// var weather = extededForecast[i].weather[0].description; 
					var humidity = extededForecast[i].main.humidity;
					var date = extededForecast[i].dt_txt;
					date = moment(date).format("dddd");
					callback(date, temperatureLatestMax,weatherIcon, humidity);
						function kelvinToF (k) {
		        return Math.round((k-273.15)*1.80 +32,0);
		      }		
			}
	});
}

  //A function to call all APIs outside of the click event
function callAllApis(placeSearched,callback){
	console.log(placeSearched);
	events(placeSearched, function(eventPageUrl,imgUrl,eventName,eventDate) {
	// $("#eventItems").append("<div style='margin: 1px;'><a href="+eventPageUrl+" target=_blank><img class= 'img-rounded' src="+imgUrl+
	// 			"><div><h6 class='text-muted text-center text-info' style='margin: 1px;'>"+eventName+" <br> <span class='text-muted text-center'>"+eventDate+"</span></h6></div></a></div> ");

	});				
	console.log('all APis call executed');
	findWeatherInCity(placeSearched, function(temperature) {
	$("#weather-table").append("<span style='margin: 4px;'>" + placeSearched + 
		"</span><span style='margin: 4px;'>" + temperature + " &#8457"+ "<img src="+iconUrl+
		"></span><button id='5day' data-toggle='collapse'>"+'5 Day Forcast'+"</button><span id='5dayWeather'></span>");
	});
	
		clearEvents();	
}	
  //this block takes the users's input, assigns it a variable and stores it in Firebase//
// $("#submit").on("click", function(){
// 	// event.preventDefault(); page must refresh for slick to apply on click
// 	clearEvents();
// 		destinationCity = $("#location").val().trim();
// 	userInputReceived = 1;
// 	sessionStorage.setItem('userInputReceived',0);
// 		console.log('user input ' +destinationCity);
// 	//making the first letter of each word uppercase.
// 	destinationCity = destinationCity.toLowerCase().replace(/\b[a-z]/g, function(letter){
// 		return letter.toUpperCase();
// 	});
// 	db.ref().set({
// 		destinationCity: destinationCity,
// 	});	
// 	sessionStorage.setItem('userInputReceived',userInputReceived);
// 	$("#location").val('');	

// }); 
$(document).on("click", "#5day", function(){
	// event.preventDefault(); page must refresh for slick to apply on click
	findForecast(placeSearched, function(date, temperatureMax,weatherIcon, humidity){

	$("#5dayWeather").append(" <tr><td class='text-left'>  " + date + "  </td><td> " + temperatureMax + " &#8457 "+ " |<img src=" +weatherIcon + " ></td></tr>");
	
	});	
	$("#5dayWeather").empty();
}); 
 

// slickThings function applies the carousel functionality to the events displayed in the DOM

function slickingAround() {
	return{
	infinite: true,
  	slidesToShow: 4,
	variableWidth: true,
  	slidesToScroll: 4,
  	prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
    nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
  	autoplay: true,
  	autoplaySpeed: 5000

	};

  }

// function slickThings() {
// // if($('#eventItems').find("div"))	
// 	console.log("@slick executed!!!");
// 	$('#eventItems').slick({
// 	infinite: true,
//   	slidesToShow: 4,
// 	variableWidth: true,
//   	slidesToScroll: 4,
//   	prevArrow:"<div class='a-left control-c prev slick-prev left carousel-control' href='#eventItems'></div>",
//     nextArrow:"<div class='a-right control-c next slick-next right carousel-control' href='#eventItems'></div>",
//   	autoplay: true,
//   	autoplaySpeed: 5000,
//   	responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 4,
//         slidesToScroll: 4,
//         infinite: true,
//       }
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 2
//       }
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1
//       }
//     }]
// 		});
// } 
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
