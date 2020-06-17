import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './../css/style.css';
import chroma from "chroma-js";


var map;
var tiles;
var cooCenter = [49.2401572, 6.9969327];
var zoomLevel = 10;

var arrayMeanPLZ =[];



const scale_options = {
	"Preis": {
		valueDomain: [20, 40, 60, 100, 500],
		colorRange: ['#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
	}
};




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
    
    data.features.forEach(function(feature){
        
        var plz = feature.properties.plz;
        
        if (!(plz in lookup)) {
    lookup[plz] = 1;
    result.push(plz);
    }});
    
    
    result.forEach(function(item){
    
        var meanPLZ = {plz:0,mean:0};
        
//        console.log(item);
       
    meanPLZ.plz = item;
    meanPLZ.mean =Math.round(average(data.features.filter(function(feature){return feature.properties.plz == item}).map(function(feature){return feature.properties.preis})));
    
//    console.log(meanPLZ);
    arrayMeanPLZ.push(meanPLZ);        
    });
    
    
    
//    console.log(result);

    L.geoJSON(data,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:5,
                        fillColor: colorPreis(feature.properties.preis),
                        stroke:false,
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        var popupContent = "POPUP";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map);
});



fetch("./../json/saar.geojson")
.then(function(response) {
return response.json();
})
.then(function(data) {
    


    L.geoJSON(data, {style : style}).addTo(map).bringToBack();
});





function colorPreis(val){   
 var scale = chroma.scale(['violet','blue','green','yellow','orange','red']).domain([0,500000]);
    
    return scale(val).hex();
     
};

        function average(array) {
  return array.reduce(plus) / array.length;
    };

function plus(a, b) { return a + b; };

function style(feature) {
    return {
        fillColor: colorMean(feature.properties.plz),
        fillOpacity : 0.6,
        weight: 1,
        opacity: 1,
        color: 'black'

    };
};

function colorMean(val){   
    

 var scale = chroma.scale(['violet','blue','green','yellow','orange','red']).domain([0,500000]);
    
 var filtered = arrayMeanPLZ.find(function(item){return item.plz == val});
    
    if (filtered != undefined){
        
        console.log(filtered.mean);
        var scaled = scale(filtered.mean).hex();
        return scaled;
    }else{
        
            return "transparent";  
        
    }
    
    
//var mean = filtered.mean;


//    
//    
//        
//   console.log(scaled);
    
//   return scale(val).hex();


     
};