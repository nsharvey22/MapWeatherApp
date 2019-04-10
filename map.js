// Mapbox map that displays current weather conditions for a selected location
// Created by: Nicholas Harvey
// 04/08/2019

mapboxgl.accessToken = 'pk.eyJ1IjoibnNoYXJ2ZXkiLCJhIjoiY2p1N3VlYXdvMXlhdTQzcXY2YTJraGhweiJ9.fi8is9_soEm60SrBvEkDGw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-96, 37.8],
    zoom: 3
});

// Geocoder search bar
map.addControl(new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
}));

// Zoom in/out buttons
map.addControl(new mapboxgl.NavigationControl());

// OpenWeatherMap API key
var owmAPIkey = "560162530bb47ee465a244a78eb26fc7"

// On mouse click, display weather information for a given town/city in a popup
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    var cityName = features[0].properties.name;

    // Checks if user clicks on an actual named feature
    if (cityName !== undefined) {
        // Create a request variable and assign a new XMLHttpRequest object to it.
        var request = new XMLHttpRequest()

        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + owmAPIkey, true)

        request.onload = function () {
          // Begin accessing JSON data here
          var data = JSON.parse(this.response)

          condition = data.weather[0].main
          icon = data.weather[0].icon

          // openweathermap api gives temp in Kelvin
          temp = data.main.temp
          
          // attatch Fahrenheit symbol to int
          fahrenheitTemp = kelvinToFahrenheit(temp) + 'ºF'

          // Popup only occurs when clicked on valid town/city. Popup won't show when clicking inbetween labels and other named places on the map like national parks.
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML("<h1 style='text-align: center'>" + cityName + "</h1> <img style='display: block; margin-left: auto; margin-right: auto; width: 60%' src='http://openweathermap.org/img/w/" + icon + ".png'> <p style='text-align: center; font-size: 16px'>" + condition + "</p> <h3 style='text-align: center; font-size: 36px'>" + fahrenheitTemp + "</h3>")
            .addTo(map);
        }

        // Send request
        request.send()
        
        var coordinates = features[0].geometry.coordinates.slice();
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        } 
    } 
});

// Changes mousepointer to a 'pointer' when hovering over a clickable feature
map.on('mousemove', function(e) { 
    
    var features = map.queryRenderedFeatures(e.point);
    var cityName = features[0].properties.name;

    // Checks if user clicks on an actual named feature
    if (cityName !== undefined) {
        map.getCanvas().style.cursor = 'pointer';
    } else {
        // Changes back to crosshair when not hovering over a feature
        map.getCanvas().style.cursor = 'crosshair';
    }
});

function kelvinToFahrenheit(temp) {
    // convert Kelvin temp to Fahrenheit
    temp = 9/5 * (temp - 273) + 32;
    // round to nearest int
    temp = Math.round(temp)

    return temp;
}

