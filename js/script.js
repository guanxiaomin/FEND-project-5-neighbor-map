// location data
var locationData = [
  ["Safeway", 37.40312000000001, -122.07936999999998],
  ["Costco", 37.4209479, -122.09578479999999],
  ["Whole Foods", 37.39889159999999, -122.11069789999999],
  ["Chef Zhao", 37.399485, -122.075275],
  ["In-N-Out Burger", 37.380407, -122.0740],
  ["Starbucks", 37.38759199999999, -122.08310180000001]
];

// init map
var map;
var service;
var infowindow;

function initMap() {
  var pyrmont = {lat: 37.3894, lng: -122.0819};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 13
  });

  infowindow = new google.maps.InfoWindow({maxWidth: 200});
}

// location class with marker and info window
function Point(name, lat, lng) {

  this.name = name;
  this.lat = lat;
  this.lng = lng;

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    title: name,
    map: map
  });

  google.maps.event.addListener(this.marker, 'click', function() {
    var pos = this.getPosition();
    getFourSquare(this.title, pos.lat(), pos.lng(), this);
    
  });
}

// get Foursquare info and pass to Info Window
function getFourSquare(name, lat, lng, marker) {
  var fourSqURL = 'https://api.foursquare.com/v2/venues/search?client_id=KPJVGNXT2YLGWI5BNBBTYM2DJ5INCF5KEUMTYNLTLKBZHASB&client_secret=W2ABQ51JQIYTIXRSO0OHEMWWL13BE5VME2TD5XDBZPXF4N3S&v=20130815&ll=' + lat + ',' +lng;
  $.getJSON(fourSqURL).done(function(data) {
      var item = data.response.venues[0];
      var infoContent = '<h4>'+ item.name + '</h4>' + 
        '<p>' + item.contact.formattedPhone +'</p>'+
        '<p>' + item.stats.checkinsCount +" Checkins" +'</p>'+
        '<p>' + item.url + '</p>'+
        '<p>' + item.hereNow.summary +'</p>';
      infowindow.setContent(infoContent);
      infowindow.open(map, marker);
  }).fail(function(e) {
    console.log("4sq error");
    infowindow.setContent("Foursquare data could not be loaded");
    infowindow.open(map, marker);
  });
}

var LocationViewModel = function() {
  self = this;
  var points = [];
  for (i = 0; i < locationData.length; i++) {
    var data = locationData[i];
    points.push(new Point(data[0], data[1], data[2]))
  }
  self.allLocs = ko.observableArray(points);
  self.query = ko.observable("");
  
  // console.log(self.allLocs());
  self.filtered = ko.computed(function() {
    self.allLocs().forEach(function(item) {
      item.marker.setMap(null);
    });
    var arr = ko.utils.arrayFilter(self.allLocs(), function(item) {
      // console.log(self.query());
       return item.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
    arr.forEach(function(item) {
      item.marker.setMap(map);
    });
    return arr;
  });
  // console.log(self.filtered());
};

function initApp() {
  initMap();
  ko.applyBindings(LocationViewModel);
}