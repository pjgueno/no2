import leaflet from 'leaflet';
import hash from 'leaflet-hash';
import 'leaflet/dist/leaflet.css';
import './../css/style.css';
import leafletSidebarV2 from 'leaflet-sidebar-v2';
import {scaleLinear} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate'


var map;
var tiles;
var cooCenter = [48.1077,-1.6895];
var zoomLevel = 12;

var cities =["rennes","tallinn","budapest","prague","dnipro","minsk","fidenza","moscou","dolgoprudny"];


const scale_options = {
	NO2: {
//		valueDomain: [20, 40, 60, 100, 500],
        valueDomain: [0, 40, 90, 120, 230, 400],
//		colorRange: ['#00796B', '#F9A825', '#E65100', '#DD2C00', '#960084']
        colorRange: ['rgb(0,85,0)', 'rgb(0,85,0)', 'rgb(0,170,0)', 'rgb(255,170,0)', 'rgb(255,85,0)', 'rgb(170,0,0)']
	}
};

//rgb(169, 169, 169)
//rgb(0,85,0)
//rgb(0,170,0)
//rgb(255,170,0)
//rgb(255,85,0)
//rgb(170,0,0)
//

var mobile = mobileCheck ();

var dataPoints;


  var colorScale =scaleLinear()
    .domain(scale_options.NO2.valueDomain)
    .range(scale_options.NO2.colorRange)
    .interpolate(interpolateRgb);


window.onload=function(){

    map.setView(cooCenter, zoomLevel);
	map.on('moveend', function() {});
	map.on('move', function() {});
	map.on('zoomend', function() {
        var zl = map.getZoom();        
        if(mobile == false && zl <= 9){
                   dataPoints.setStyle({radius:2});
           }else if(mobile == false && zl < 12 && zl > 9){
                dataPoints.setStyle({radius:5});
           }else if(mobile == false){
                               dataPoints.setStyle({radius:10});
           };
    });
    
    map.on('click', function(e) {
    map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
	});
    
    

};




    

map = L.map('map',{ zoomControl:true,minZoom:1,doubleClickZoom:false});

tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
			attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
			maxZoom: 18}).addTo(map);

new L.Hash(map);


 document.getElementById("menu").addEventListener("click", toggleSidebar); 


fetch("./../json/data.json")
.then(function(response) {
return response.json();
})
.then(function(data) {
    
    var lookup = {};
    var result = [];
//    console.log(result);

     dataPoints = L.geoJSON(data,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:responsiveRadius(mobile),
                        fillColor: colorScale(feature.properties.value),                                             
                        stroke:true,
                        weight:2,
                        color:stations(feature),
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        
                          var traficLevel;
                          var stations;
                          var popupContent;
                          
                          if (feature.properties.trafic == 0) {traficLevel="low"}else{traficLevel="high"};
                          if (feature.properties.ostation == 0) {stations = "No official station around" }else if (feature.properties.ostation==1){stations = "Official station around"} else {stations = "N/A"};
                          
                        if (feature.properties.value != 0 && feature.properties.remark == ""){
                        
                        popupContent = "<h1>#NO2 Campaign 2020</h1><p><b>City</b> : "+feature.properties.city+"</p><p><b>Group</b> : "+feature.properties.group+"</p><p><b>Tube ID</b> : "+feature.properties.tubeId+"</p><p><b>Height</b> : "+feature.properties.height+"</p><p><b>Trafic</b> : "+traficLevel+"</p><p><b>Information</b> : "+feature.properties.info+"<br><br><b>"+stations+"</b></p><p><b>Value</b> : "+feature.properties.value+"</p>";
                          
                            }else{
                        
                         popupContent = "<h1>#NO2 Campaign 2020</h1><p><b>City</b> : "+feature.properties.city+"</p><p><b>Group</b> : "+feature.properties.group+"</p><p><b>Tube ID</b> : "+feature.properties.tubeId+"</p><p><b>Height</b> : "+feature.properties.height+"</p><p><b>Trafic</b> : "+traficLevel+"</p><p><b>Information</b> : "+feature.properties.info+"<br><br><b>"+stations+"</b></p><p><b>Remark</b> : "+feature.properties.remark+"</p>";
                                
                                
                            };
                          
                          
                          
                          
                          
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map).bringToFront();
    
    
                document.getElementById("loading_layer").style.display ="none";

    
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
                        fillColor: 'blue',
                        stroke:false,
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        
                        var popupContent = "<h1>Official EU Station</h1><p><b>City</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map).bringToFront();;
});


fetch("./../json/budapeststations.json")
.then(function(response) {
return response.json();
})
.then(function(data) {
    
    var lookup = {};
    var result = [];

    L.geoJSON(data,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:4,
                        fillColor: 'red',
                        stroke:true,
                        width:1,
                        color:'#32CD32',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        
                        var popupContent = "<h1>Budapest Station</h1><p><b>City</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map);
});



var POSTData = {
  "locale": "ru_RU",
  "mapType": "air",
  "element": "PM2.5" // or 'element': 'PM10' for PM 10 stations.
};


//
//
//var dataPOST = new FormData();
//
//for(var i in POSTData){
//   dataPOST.append(i,POSTData[i]);
//};
//
//var dataPOST2 = Object.fromEntries(dataPOST.entries());
//var dataPOST3 = JSON.stringify(dataPOST2);
//
//console.log(dataPOST3);
//
//
//
//
//
//
//
//console.log(dataPOST);
//
//fetch("https://mosecom.mos.ru/wp-content/themes/moseco/map/stations-new.php",{method:"POST", body:dataPOST3})
//.then(function(response) {
//return response.json();
//})
//.then(function(data) {
//    
//    console.log(data);
//    
//});
//
//
//
//




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




function mobileCheck () {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
     
// TABLET
     
//       let check = false;
//  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
//  return check;
     
     
}

function responsiveRadius(bool){
    if (bool == true){
         return 20
        }else{   
        return 10
        }   
}



function openSidebar() {
	document.getElementById("menu").innerHTML = "&#10006;";
	document.getElementById("sidebar").style.display = "block";
}

function closeSidebar() {
	document.getElementById("menu").innerHTML = "&#9776;";
	document.getElementById("sidebar").style.display = "none";
}

function toggleSidebar() {
	if (document.getElementById("sidebar").style.display === "block") {
		closeSidebar();
	} else {
		openSidebar()
	}
}









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