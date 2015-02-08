function showList(nearest) {
  $('#closest-list').html('');
  $('#list').removeClass('hidden');
  $('#list').removeClass('text-center');
  if (nearest.length > 0) {
    //for every nearby one, add it to the list
    nearest.forEach(function (value) {
      $('#closest-list').append('<li><i class="fa-li fa fa-map-marker"></i>' + value.layer.feature.properties.standort + '</li>');
    });
  } else {
    // if there no nearby one, tell the user that
    $('#main').html('<i class="fa fa-warning"></i> Either your GPS did not load properly or there are none nearby. Remember this app is currently only available in Charlottenburg Wilmersdorf in Berlin. <br> <button name="button" class="btn btn-primary btn-lg" onClick="window.location.reload()"><i class="fa fa-refresh"></i> Try again</button>');

  }

}

function getNearest(position){
  var lng = position.coords.longitude,
      lat = position.coords.latitude,
      accuracy = position.coords.accuracy;

  // the line below is for debugging only, it shows the location that we're using to query
  // $('#location').html("Longitude: " + lng + ', ' + "Latitude: " + lat  + ', Accuracy within '+ accuracy + 'm');
  $('#location').remove(); //remove the loading animation.

  nearest = window.index.nearest([lng, lat], 5, 9999); //find closest 5 items, within 9999 meters

  showList(nearest); //add the nearest items to the webpage.
}

function getLocation(cb) {
  // if we can get the coords from the browser, let's do it.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(cb);
  } else {
    // if we can't get the coords, tell the user.
    $('body').html("Geolocation is not supported by your browser. This app does not currently work for you.");
  }

}

window.onload = function(){
  //when it loads there's an overlay already that says "loading..."

  //bind button triggers
  $('#find-btn').click(function() {
    //prevent default behavior here
    $('#location').html('<i class="fa fa-spinner fa-pulse fa-4x"></i> <br> Getting your location... <br> (You may need to allow this in your settings)')
    getLocation(getNearest);
  });

  //bind example location trigger
  $('#example-location-btn').click(function() {
    //prevent default behavior here
    $('#location').html('<i class="fa fa-spinner fa-pulse fa-4x"></i>')
    var examplePosition = { coords : {} };
    examplePosition.coords.longitude = 13.2944103;
    examplePosition.coords.latitude = 52.5048799;
    examplePosition.coords.accuracy = 5;
    getNearest(examplePosition);

  })

  //load geojson data
  $.getJSON("data/all.geojson", function(data) {
    points = data;
  })
  .done(function(){

    // after geojson is loaded, remove the loading image & overlay
    $('#overlay').remove()

    //make data ready to find nearest
    var gj = L.geoJson(points); //make a geojson layer of points
    window.index = leafletKnn(gj); //make an index of points with Knn
  });
}
