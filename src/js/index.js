import leaflet from 'leaflet';
import hash from 'leaflet-hash';
import 'leaflet/dist/leaflet.css';
import './../css/style.css';
import leafletSidebarV2 from 'leaflet-sidebar-v2';


var map;
var tiles;
var cooCenter = [46.256, 17.666];
var zoomLevel = 5;

var cities =["rennes","tallinn","budapest","prague","dnipro","minsk","fidenza","moscou","dolgoprudny"];


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

new L.Hash(map);


var sidebar = L.control.sidebar({
    autopan: false,       // whether to maintain the centered map point when opening the sidebar
    closeButton: true,    // whether t add a close button to the panes
    container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
    position: 'left',     // left or right
}).addTo(map);

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
                        stroke:true,
                        weight:2,
                        color:stations(feature),
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        
                          var traficLevel;
                          var stations;
                          
                          if (feature.properties.trafic == 0) {traficLevel="low"}else{traficLevel="high"};
                          if (feature.properties.ostation == 0) {stations = "No official station around" }else if (feature.properties.ostation==1){stations = "Official station around"} else {stations = "N/A"};

                          
                        var popupContent = "<h1>#NO2 Campaign 2020</h1><p><b>City</b> : "+feature.properties.city+"</p><p><b>Group</b> : "+feature.properties.group+"</p><p><b>Tube ID</b> : "+feature.properties.id+"</p><p><b>Height</b> : "+feature.properties.height+"</p><p><b>Trafic</b> : "+traficLevel+"</p><p><b>Information</b> : "+feature.properties.info+"<br><br><b>"+stations+"</b></p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map);
});
//
//fetch("./../json/eustations.json")
//.then(function(response) {
//return response.json();
//})
//.then(function(data) {
//    
//    var lookup = {};
//    var result = [];
////    console.log(result);
//
//    L.geoJSON(data,{
//                      pointToLayer: function (feature, latlng) {
//                       return L.circleMarker(latlng, {
//                        radius:3,
//                        fillColor: '#808080',
//                        stroke:false,
//                        fillOpacity: 1})
//                      },
//                      onEachFeature: function (feature, layer) {
//                        
//                        var popupContent = "<h1>Official EU Station</h1><p><b>City</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
//                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
//                      }}).addTo(map);
//});


fetch("./../json/eustations_inter.json")
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
                        radius:3,
                        fillColor: '#808080',
                        stroke:false,
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        
                        var popupContent = "<h1>Official EU Station</h1><p><b>City</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
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

//
function stations(feature){    
    if (feature.properties.ostation == 1) {return "#ff0000" }else {return "transparent"};
};


//AJOUTER LES SATTIONS DANS LES CONVEX HULL

//INFO:
//
//https://airindex.eea.europa.eu/Map/AQI/Viewer/current?dt=2020-08-26T08:00:00.000Z&polu=0&stclass=All
//
//stclass Non-traffic Traffic
//
//polu=0
//
//0	"StationCode"
//1	"SamplingPoint"
//2	"PollutantId"
//3	"WorstPollutantId"
//4	"BandId"
//5	"WorstBandId"
//6	"Value"
//7	"CAMS"
//8	"Worst"
//9	"StationClassification"
//10	"AreaClassification"
//11	"NormalizedValue"
//12	"Compliant"
//13	"NODATA"
//
//https://airindex.eea.europa.eu/Map/AQI/Viewer/instant?dt=2020-08-26T05%3A00%3A00.000Z&st=FR33203
//https://airindex.eea.europa.eu/Map/AQI/Viewer/pie?st=FR33203&polu=0
//https://airindex.eea.europa.eu/Map/AQI/Viewer/pastDays?st=FR33203&dt=2020-08-26T05%3A00%3A00.000Z

//https://airindex.eea.europa.eu/Map/AQI/Viewer/forecast?dt=2020-08-27T07%3A00%3A00.000Z&polu=0&stclass=All

//https://airindex.eea.europa.eu/Map/AQI/Viewer/current?dt=2020-08-26T13%3A00%3A00.000Z&polu=0&stclass=All

//A VOIR:
//var pollutants = {"SO2":1,"PM10":192,"PM2.5":246,"O3":352,"NO2":423};

//CALL POUR LES TYPE DE VALEURS

//https://airindex.eea.europa.eu/Map/AQI/Viewer/instant?dt=2020-08-26T12%3A50%3A00.000Z&st=DEBY004