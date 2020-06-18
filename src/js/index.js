import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './../css/style.css';

var map;
var tiles;
var cooCenter = [49.2401572, 6.9969327];
var zoomLevel = 10;

var cities =["rennes","tallinn","budapest","prague"];


window.onload=function(){

    map.setView(cooCenter, zoomLevel);
	map.on('moveend', function() {});
	map.on('move', function() {});
	map.on('click', function(e) {
		map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
	});

};

map = L.map('map',{ zoomControl:true,minZoom:1,doubleClickZoom:false});

tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
			attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
			maxZoom: 18}).addTo(map);


fetch("./../json/data.json")
.then(function(response) {
return response.json();
})
.then(function(data) {
    
    var lookup = {};
    var result = [];
//    console.log(result);

    L.geoJSON(data,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: feature.properties.color,
                        stroke:false,
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        var popupContent = "<h1>#NO2 Campaign 2020</h1><p><b>City</b> : "+feature.properties.city+"</p><p><b>Group</b> : "+feature.properties.group+"</p><p><b>Tube ID</b> : "+feature.properties.id+"</p><p><b>Height</b> : "+feature.properties.height+"</p><p><b>Trafic</b> : "+feature.properties.trafic+"</p><p><b>Information</b> : "+feature.properties.info+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map);
});

cities.forEach(function(item){
    
    var city = item + ".geojson";
    fetch("./../json/"+city).then(function(response) {
return response.json();
})
.then(function(data) {
        console.log(data);
    L.geoJSON(data).addTo(map).bringToBack();
});   
});
