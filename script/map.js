/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;
var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};



function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  const getLocButton = document.querySelector("#getLocation");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  getLocButton.addEventListener("click", () => {
    $('#Results').html("Loading...");
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
          console.log(position)

          getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="+pos.lat+","+pos.lng+"&key=AIzaSyDL1YlMnOHhqWZUoIxSe_HEM67MiuEwf04&language=en&sensor=false",
          function(err, data) {
            console.log(data.results)
            let zip_code = "";
            let province = "";
            let brgy = "";
            let city = "";
            let resultsData = data.results;
            let firstData = data.results[0].address_components
            $('#Results').html("");
            
            console.log(resultsData)
            // firstData.forEach(function(address){
            //   $('#Results').append("<div>"+ address.long_name + " - " + address["types"][0] +"</div>");
            //  })

            resultsData.forEach((element) => {
              // console.log(element)
              element.address_components.forEach(function(address){
                // $('#Results').append("<div>"+ address.long_name + " - " + address["types"][0] +"</div>");
                if(address["types"][0] == 'postal_code') {
                  zip_code = address.long_name
                }

                if(address["types"][0] == 'administrative_area_level_2') {
                  province = address.long_name
                }

                if(address["types"][0] == 'administrative_area_level_5') {
                  brgy = address.long_name
                }
                
                if(address["types"][0] == 'locality') {
                  city = address.long_name
                }
              })
            });
            
            // $('#Results').append("<div>"+ address.long_name + " - " + address["types"][0] +"</div>");
            $('#Results').append("<div>Zip Code: "+ zip_code +"</div>")
            $('#Results').append("<div>Province: "+ province +"</div>")
            $('#Results').append("<div>brgy: "+ brgy +"</div>")
            $('#Results').append("<div>City: "+ city +"</div>")
          });

        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
