function autocomplete() {
	var input = $('#location').val();
	var autocomplete = new google.maps.places.autocomplete(input);
	console.log(autocomplete);
	$('#location').html(autocomplete);
};


// $('#location').on('keyup', function () {
// 	var ui = $(this).val();
// 	var uiArray = [];
// 	uiArray.push(ui);
// 	uiArray = uiArray.toString();
// 	console.log(uiArray);
// 	var locationURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+ uiArray +"&types=(cities)&language=en&key=AIzaSyDfwe1DfMd-wWuSdcx-8p-e2fMHLYGaqi4";
// 	$.ajax({
// 		url:locationURL,
// 		method: 'GET'
// 	}).done(function(response){
// 		console.log(response);
// 		autocomplete = response.predictions[0].description;

// 		for(predictions = 0; predictions=<5, i++){
// 			var predictionsArray = [];
// 			predictionsArray.push(autocomplete);
// 			predictionsArray.list();
// 			console.log(predictionsArray);
// 		};
// 		// $(autocomplete).each(response){

// 		// }
// 		console.log(autocomplete);
// 	});
// });


// var location = $('#location').val();

// $(function autocomplete(argument) {
	// body..	
	//var predictions = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+ location +"&types=geocode&language=en&key=AIzaSyDfwe1DfMd-wWuSdcx-8p-e2fMHLYGaqi4";
	
	// var autocomplete = new autocomplete(input: {
	// 	min char: 3,
	// 	autoFirst: true
	// });
	// autocomplete();
//needs to be called
	// $(location).on('keyup', function aComplete(argument) {
	// 	$.ajax({
	// 		url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+ location +"&types=geocode&language=en&key=AIzaSyDfwe1DfMd-wWuSdcx-8p-e2fMHLYGaqi4",
	// 		method: 'GET',
	// 		datatype: 'json'
	// 	}).success(function() {
	// 		var suggestions = [];
	// 		$.each(location, function(key, value) {
	// 			$('#location').html($(suggestions));
				//line 21 may not work. also why html?
				//plus why 2 functions? It is possible to merge into 1 big function.
				//need to figure out how to display it as a dropdown
				
	// 			console.log(predictions);
	// 		});
	// 	});
	// });
	//needs to be called
	// aComplete();