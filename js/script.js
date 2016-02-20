var locationData = [
  {name: "Safeway"}, 
  {name: "Costco"}, 
  {name: "Whole Foods"}, 
  {name: "Chef Zhao"}, 
  {name: "In-N-Out Burger"}, 
  {name: "Starbucks"}];

// function Location
var LocationViewModel = function() {
  self = this;
  self.allLocs = ko.observableArray(locationData);
  self.query = ko.observable("");
  // console.log(self.allLocs());
  self.filtered = ko.computed(function() {
    return ko.utils.arrayFilter(self.allLocs(), function(item) {
      // console.log(self.query());
      return item.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });
  // console.log(self.filtered());
  // console.log(self.allLocs());
};

ko.applyBindings(new LocationViewModel());

var map;
var service;
var infowindow;

function initMap() {
  var pyrmont = {lat: 37.3894, lng: -122.0819};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 13
  });

  infowindow = new google.maps.InfoWindow();

  service = new google.maps.places.PlacesService(map);
  for (var i=0; i<locationData.length; i++) {
    var request = {
      location: pyrmont,
      radius: '500',
      query: locationData[i].name
    }
    service.textSearch(request, callback);
  } 
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    createMarker(results[0]);
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    // title: formatted_address
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}
// Sets the map on all markers in the array.
// function setMapOnAll(map) {
//   for (var i = 0; i < locationData.length; i++) {
//     locationData[i].name.setMap(map);
//   }
// }

// function clearMarkers() {
//   setMapOnAll(null);
// }