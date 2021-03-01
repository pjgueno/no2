import leaflet from 'leaflet';
import hash from 'leaflet-hash';
import 'leaflet/dist/leaflet.css';
import './../css/style.css';
import leafletSidebarV2 from 'leaflet-sidebar-v2';
import {scaleLinear} from 'd3-scale';
import {interpolateRgb} from 'd3-interpolate';
import {csvParse} from 'd3-dsv';
import {geoContains} from 'd3-geo';

var map;
var tiles;
var cooCenter = [52.107,15.798];
var zoomLevel = 5;
var geojsonCities = [];


var cities =["rennes","tallinn","budapest","prague","dnipro","minsk","fidenza","moscow","dolgoprudny"];

var listeCode = [];


//const scale_options = {
//	NO2: {
//        valueDomain: [0, 40, 90, 120, 230, 400],
//        colorRange: ['rgb(0,85,0)', 'rgb(0,85,0)', 'rgb(0,170,0)', 'rgb(255,170,0)', 'rgb(255,85,0)', 'rgb(170,0,0)']
//	}
//};

const scale_options = {
	NO2: {
        valueDomain: [0, 20, 30, 40, 50, 200],
        colorRange: ['#4B8246', '#4B8246', '#9FD08C', '#EFEDB4', '#F47A70', '#8C161E']
	}
};







var mobile = mobileCheck ();
var dataPoints;
var stationPoints;
var stationPoints2;
var stationPoints3;
var stationPoints4;

var colorScale = scaleLinear()
    .domain(scale_options.NO2.valueDomain)
    .range(scale_options.NO2.colorRange)
    .interpolate(interpolateRgb);


var labelBaseOptions = {
    iconUrl: './images/lab_marker.svg',
    shadowUrl: null,
    iconSize: new L.Point(21, 35),
    iconAnchor: new L.Point(10, 34),
    labelAnchor: new L.Point(25, 2),
    wrapperAnchor: new L.Point(10, 35),
    popupAnchor:  [-0, -35]
};

var labelRight = L.Icon.extend({
    options: labelBaseOptions
});



window.onload=function(){
    map.setView(cooCenter, zoomLevel);
	map.on('moveend', function() {});
	map.on('move', function() {});
	map.on('zoomend', function() {
        var zl = map.getZoom();

        if(mobile == false && zl <= 9){
                   dataPoints.setStyle({radius:0.1});
            stationPoints.setStyle({radius:0.1});
            stationPoints2.setStyle({radius:0.1});
            stationPoints3.setStyle({radius:0.1});
            stationPoints4.setStyle({radius:0.1});
           }else if(mobile == false && zl < 12 && zl > 9){
                dataPoints.setStyle({radius:5});
                stationPoints.setStyle({radius:5});
               stationPoints2.setStyle({radius:5});
               stationPoints3.setStyle({radius:5});
               stationPoints4.setStyle({radius:5});
           }else if(mobile == false){
               dataPoints.setStyle({radius:10});
                stationPoints.setStyle({radius:10});
               stationPoints2.setStyle({radius:10});
               stationPoints3.setStyle({radius:10});
               stationPoints4.setStyle({radius:10});
           };



        if(mobile == true && zl <= 9){
                   dataPoints.setStyle({radius:5});
                    stationPoints.setStyle({radius:5});
            stationPoints2.setStyle({radius:5});
            stationPoints3.setStyle({radius:5});
            stationPoints4.setStyle({radius:5});
           }else if(mobile == true && zl < 12 && zl > 9){
                dataPoints.setStyle({radius:15});
                stationPoints.setStyle({radius:15});
               stationPoints2.setStyle({radius:15});
               stationPoints3.setStyle({radius:15});
               stationPoints4.setStyle({radius:15});
           }else if(mobile == true){
               dataPoints.setStyle({radius:20});
                stationPoints.setStyle({radius:20});
               stationPoints2.setStyle({radius:20});
               stationPoints3.setStyle({radius:20});
               stationPoints4.setStyle({radius:20});
           };



    });

};

map = L.map('map',{ zoomControl:true,minZoom:1,doubleClickZoom:false});

tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
			attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
			maxZoom: 18}).addTo(map);

new L.Hash(map);

document.getElementById("menu").addEventListener("click", toggleSidebar);

fetch("./json/data.json")
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {
         dataPoints = L.geoJSON(data,{
                          pointToLayer: function (feature, latlng) {
                           return L.circleMarker(latlng, {
                            radius:responsiveRadius(mobile),
                            fillColor: colorScale(feature.properties.value),                       stroke:true,
                            weight:2,
                            stroke: false,
                            color:stations(feature),
                            fillOpacity: 1})
                          },
                          onEachFeature: function (feature, layer) {
                              var traficLevel;
                              var stations;
                              var popupContent;

                            if (feature.properties.trafic == 0) {traficLevel="low"}else{traficLevel="high"};

                            if (feature.properties.value != 0 && feature.properties.remark == ""){
                                popupContent = "<h2>#NO2 Campaign 2020</h2><p><b>City</b> : "+feature.properties.city+"</p><p><b>Group</b> : <a target='_blank' rel='noopener noreferrer' href='"+feature.properties.link+"'>"+feature.properties.group+"</a></p><p><b>Tube ID</b> : "+feature.properties.tubeId+"</p><p><b>Height</b> : "+feature.properties.height+" m</p><p><b>Trafic</b> : "+traficLevel+"</p><p><b>Information</b> : "+feature.properties.info+"<br><br><b>Value</b> : "+feature.properties.value+" µg\/m&sup3; (average concentration for the month)</p>";
                            }else{
                             popupContent = "<h2>#NO2 Campaign 2020</h2><p><b>City</b> : "+feature.properties.city+"</p><p><b>Group</b> : <a target='_blank' rel='noopener noreferrer' href='"+feature.properties.link+"'>"+feature.properties.group+"</a></p><p><b>Tube ID</b> : "+feature.properties.tubeId+"</p><p><b>Height</b> : "+feature.properties.height+" m</p><p><b>Trafic</b> : "+traficLevel+"</p><p><b>Information</b> : "+feature.properties.info+"<br><br><b>Remark</b> : "+feature.properties.remark+"</p>";
                                };
                            layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                          }}).addTo(map).bringToFront();
                    document.getElementById("loading_layer").style.display ="none";
    });


fetch("./json/eustations_inter.json")
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {
        data.features.forEach(function(e){
        listeCode.push(e.properties.Code);
        });
});

var dateString = dateFormater(new Date());
//console.log("https://discomap.eea.europa.eu/Map/UTDViewer/dataService/AllDaily?polu=NO2&dt="+dateString);

fetch("https://discomap.eea.europa.eu/Map/UTDViewer/dataService/AllDaily?polu=NO2&dt="+dateString)
    .then(function(response) {
    return response.text();
    })
    .then(function(data) {
//        console.log(csvParse(data));

        var dataEUJson ={"type": "FeatureCollection",
        "name": "eustations_EEA",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": []};

        var mapper = csvParse(data).map(function(obj){
        var dataEUfeature = { "type": "Feature", "properties": { "Code": "", "Name": "", "Location": "", "Value": "", "Lon":"" , "Lat": "", "AreaClassification": "", "samplePointID":"", "StationClassification": "","dateBegin":"","dateEnd":""}, "geometry": { "type": "MultiPoint", "coordinates": [[ 0, 0 ]]}};

        var translated = L.Projection.SphericalMercator.unproject(new L.Point(obj.LONGITUDE, obj.LATITUDE));

        dataEUfeature.geometry.coordinates[0][0] = translated.lng;
        dataEUfeature.geometry.coordinates[0][1] = translated.lat;
        dataEUfeature.properties.Lon = (translated.lng).toString();
        dataEUfeature.properties.Lat = (translated.lat).toString();
        dataEUfeature.properties.AreaClassification = obj.AREACLASSIFICATION;
        dataEUfeature.properties.StationClassification = obj.STATIONCLASSIFICATION;
        dataEUfeature.properties.Code = obj.STATIONCODE;
        dataEUfeature.properties.Name = obj.STATIONNAME;
        dataEUfeature.properties.Location = obj.MUNICIPALITY;
        dataEUfeature.properties.samplePointID = obj.SAMPLINGPOINT_LOCALID;
        dataEUfeature.properties.Value = obj.VALUE_NUMERIC;
        dataEUfeature.properties.dateBegin = obj.DATETIME_BEGIN;
        dataEUfeature.properties.dateEnd = obj.DATETIME_END;

        return dataEUfeature;
        });

//        console.log(listeCode);
        var filtered = mapper.filter(function(e){
        return listeCode.includes(e.properties.Code) == true;
    });

//    console.log(filtered);
    dataEUJson.features = filtered;
//    console.log(dataEUJson);
    stationPoints =  L.geoJSON(dataEUJson,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:responsiveRadius(mobile),
                        fillColor: "blue",
                        stroke:true,
                        weight:2,
                        stroke:false,
                        color :'blue',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        var popupContent = "<h2>Official EU Station</h2><p><b>Name</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map).bringToFront();;
});


fetch("./json/minskstations.json")
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {

  stationPoints2 =  L.geoJSON(data,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:responsiveRadius(mobile),
                        fillColor: 'blue',
                        stroke:false,
                        color :'blue',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {

                        var popupContent = "<h2>Official Belarus Station</h2><p><b>Name</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map).bringToFront();;

});

fetch("./json/budapeststations.json")
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {

  stationPoints3 =  L.geoJSON(data,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:responsiveRadius(mobile),
                        fillColor: 'blue',
                        stroke:false,
                        color :'blue',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {

                        var popupContent = "<h2>Official Hungary Station</h2><p><b>Name</b> : "+feature.properties.Name+"</p><p><b>Area Classification</b> : "+feature.properties.AreaClassification+"</p><p><b>Station Classification ID</b> : "+feature.properties.StationClassification+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map).bringToFront();;
});


var formData = new FormData();
formData.append("locale", "ru_RU");
formData.append("mapType", "air");
formData.append("element", "NO2")


var xhr = new XMLHttpRequest();
xhr.open("POST", "https://mosecom.mos.ru/wp-content/themes/moseco/map/stations-new.php");
xhr.send(formData);

xhr.onload = function() {
    if (xhr.status != 200) {
      console.log("Loading error");
      return;
    }

    var dataRussia = {"type": "FeatureCollection","name": "moskow_stations","crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },"features": []};

    var mapper = JSON.parse(xhr.response).able.map(function(obj){
        var dataEUfeature = { "type": "Feature", "properties": { "Code": "", "Name": "", "Location": "", "Value": "", "Lon":"" , "Lat": "", "AreaClassification": "", "samplePointID":"", "StationClassification": "","dateBegin":"","dateEnd":""}, "geometry": { "type": "MultiPoint", "coordinates": [[ 0, 0 ]]}};

        dataEUfeature.geometry.coordinates[0][0] = obj.longitude;
        dataEUfeature.geometry.coordinates[0][1] = obj.latitude;
        dataEUfeature.properties.Lon = obj.longitude.toString();
        dataEUfeature.properties.Lat = obj.latitude.toString();
        dataEUfeature.properties.Name = obj.full_name;

        return dataEUfeature;
        });





// console.log(mapper);

    dataRussia.features = mapper;
//    console.log(dataRussia);
stationPoints4 =  L.geoJSON(dataRussia,{
                      pointToLayer: function (feature, latlng) {
                       return L.circleMarker(latlng, {
                        radius:responsiveRadius(mobile),
                        fillColor: "blue",
                        stroke:true,
                        weight:2,
                        stroke:false,
                        color :'blue',
                        fillOpacity: 1})
                      },
                      onEachFeature: function (feature, layer) {
                        var popupContent = "<h2>Official Russia Station</h2><p><b>Name</b> : "+feature.properties.Name+"</p>";
                        layer.bindPopup(popupContent,{closeButton:true, maxWidth: "auto"});
                      }}).addTo(map).bringToFront();;

  }



cities.forEach(function(item){

    var city = item + ".geojson";
    fetch("./json/"+city).then(function(response) {
return response.json();
})
.then(function(data) {
    geojsonCities.push(data);

    var citybounds;

    var city = L.geoJSON(data,{opacity:1,weight:1}).addTo(map).bringToBack().on('click', function () {
       map.fitBounds(this.getBounds());
    });


    var citybounds = city.getBounds();

    var centroid = city.getBounds().getCenter();
    L.marker(centroid,{
				icon: new labelRight({ labelText: "<a href=\"#\"></a>"}),
                riseOnHover: true
						})
        .bindPopup("<h2>#NO2 Campaign 2020</h2><b>"+data.name.charAt(0).toUpperCase() + data.name.slice(1) + "</b> <br><br><a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://en.wikipedia.org/wiki/"+ data.name.charAt(0).toUpperCase() + data.name.slice(1) +"\">Wikipedia</a>")
        .addTo(map).on('click', function(e) {
            map.fitBounds(citybounds);
            });




    });
});

function stations(feature){
    if (feature.properties.ostation == 1) {return "#ff0000" }else {return "transparent"};
};

function mobileCheck () {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function responsiveRadius(bool){
    if (bool == true){
         return 5
        }else{
        return 0.1
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


function dateFormater(date) {

    //one day before
     date.setDate(date.getDate()-1);
//
//    var result = date.getUTCFullYear().toString() + pad(date.getUTCMonth(),2,true) + pad(date.getUTCDate(),2,false) +pad(date.getUTCHours(),2, false)+pad(date.getUTCMinutes(),2,false) + pad(date.getUTCSeconds(),2,false);

        var result = date.getUTCFullYear().toString() + pad(date.getUTCMonth(),2,true) + pad(date.getUTCDate(),2,false) +pad(date.getUTCHours(),2, false)+"00" + "00";

    return result;
}

function pad(num,size,month) {

    if (month == true){
       num += 1;
        num = num.toString();
        }else{
    num = num.toString();
}
    while (num.length < size) num = "0" + num;
    return num;
}
