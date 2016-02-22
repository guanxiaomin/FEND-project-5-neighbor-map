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
var map, service, infowindow;

function initMap() {
  var pyrmont = {lat: 37.3994, lng: -122.0819};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 12
  });

  infowindow = new google.maps.InfoWindow({maxWidth: 400});
  var bounds = new google.maps.LatLngBounds();
  locationData.forEach(function(item) {
    // console.log(item);
    var position = new google.maps.LatLng(item[1], item[2]);
    bounds.extend(position);
  });
  map.fitBounds(bounds);
}

function googleMapError(e) {
  // console.log("google map error");
  alert("Google Map Could Not Be Loaded, Please Check.");
}

// location class with marker and info window
function Point(name, lat, lng) {

  this.name = name;
  this.lat = lat;
  this.lng = lng;

  this.marker = new google.maps.Marker({
    position: {lat: this.lat, lng: this.lng},
    title: name,
    map: map,
    animation: google.maps.Animation.DROP // marker animetion
  });

  google.maps.event.addListener(this.marker, 'click', function() {
    infowindow.setContent('');
    infowindow.open(map, this);
    var pos = this.getPosition();
    // marker animetion
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
      var marker = this;
      setTimeout(function(){ marker.setAnimation(null); }, 750);
    }
    getFourSquare(this.title, pos.lat(), pos.lng(), this);
    // setTimeout(function () { infowindow.close(); }, 5000);
    google.maps.event.addListener(map, 'mouseout', function() {
      infowindow.close();
    });
  });
}

// get Foursquare info and pass to Info Window
function getFourSquare(name, lat, lng, marker) {
  var fourSqURL = 'https://api.foursquare.com/v2/venues/search?client_id=KPJVGNXT2YLGWI5BNBBTYM2DJ5INCF5KEUMTYNLTLKBZHASB&client_secret=W2ABQ51JQIYTIXRSO0OHEMWWL13BE5VME2TD5XDBZPXF4N3S&v=20130815&ll=' + lat + ',' +lng;
  $.getJSON(fourSqURL).done(function(data) {
      var item = data.response.venues[0];
      var infoContent = '<h4><a href="'+ item.canonicalUrl +'">'+ item.name + '</a></h4>' + 
        '<p>' +
          '<img src="images/info_call_ico.png">' + item.contact.formattedPhone +
          '<img src="images/info_website_ico.png">' + '<a href="' + item.url+ '">' + item.name + '.com' + '</a>' +
        '</p>' +
        '<p>' + item.stats.checkinsCount +" Checkins" +'</p>' + 
        '<p>' + item.hereNow.summary +'</p>';
      infowindow.setContent(infoContent);
  }).fail(function(e) {
    console.log('4sq error');
    infowindow.setContent('Foursquare data could not be loaded');
    
  });
}

var LocationViewModel = function() {
  var self = this;
  var points = [];
  for (var i = 0; i < locationData.length; i++) {
    var data = locationData[i];
    points.push(new Point(data[0], data[1], data[2]))
  }
  self.allLocs = ko.observableArray(points);

  self.selectPoint = function(item) {
    // console.log(item);
    google.maps.event.trigger(item.marker, 'click');
  }

  self.query = ko.observable('');
  // console.log(self.allLocs());
  self.filtered = ko.computed(function() {
    infowindow.close();
    return ko.utils.arrayFilter(self.allLocs(), function(item) {
      // console.log(self.query());
      var flag = item.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      item.marker.setVisible(flag);
      return flag;
    });
  });
  // console.log(self.filtered());
};

function initApp() {
  initMap();
  ko.applyBindings(LocationViewModel);
}