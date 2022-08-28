function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert("Sorry, but Geolocation is not supported by this browser.");
	}
}

function showPosition(position) {
	var lat = position.coords.latitude;
	var long = position.coords.longitude;
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDL1YlMnOHhqWZUoIxSe_HEM67MiuEwf04";
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function (msg) {
			var results = msg.results;
			var zip = results[0].address_components[6].long_name;
			alert("Your zip code is: " + zip);
		},
		error: function (req, status, error) {
			alert('Sorry, an error occurred.');
			console.log(req.responseText);
		}
	});
}

// getLocation()