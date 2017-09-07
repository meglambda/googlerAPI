$().ready(function locationComplete(argument) {
	
	$("#arrivalDestination").autocomplete({
		delay: $("#arrivalDestination").on("keyup", function ui(){
			var ui = " ";
			type(ui){
				key.charAt(Math.floor(Math.random()*key.length));
				return ui;
				console.log(ui);
			};
			var suggestionsURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+ ui +"&types=geocode&language=en&key=AIzaSyDfwe1DfMd-wWuSdcx-8p-e2fMHLYGaqi4";
			
			var suggestions =
				$.ajax({ 
					url: suggestionsURL,
					method: 'GET'  
				}).done(function(){
					if(ui===suggestions.charAt){
						//meat of code. need to have a dropdown of suggestions where one can click on one of the
						//suggestions if they desire. only on cpus, not mobile responsiveness!; will need new
						//div to display dropdown suggestions					
					};

				});
		});
		source: locationComplete(){

		};
	});

	var location = ;
	var autocompleteURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input="+ location +"&types=geocode&language=en&key=AIzaSyDfwe1DfMd-wWuSdcx-8p-e2fMHLYGaqi4";
// API Key: AIzaSyDfwe1DfMd-wWuSdcx-8p-e2fMHLYGaqi4

	
});

locationComplete();