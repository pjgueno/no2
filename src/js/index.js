import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './../css/style.css';
import autocomplete from 'autocompleter';

var map;
var tiles;
var cooCenter = [48.8534, 2.3488];
var zoomLevel = 7;

var fromages = [];



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


//fetch("./../geojson/banon.geojson")
//.then(function(response) {
//return response.json();
//})
//.then(function(data) {
//L.geoJSON(data).addTo(map);
//});
//
//fetch("./../geojson/beaufort.geojson")
//.then(function(response) {
//return response.json();
//})
//.then(function(data) {
//L.geoJSON(data).addTo(map);
//});
//
//fetch("./../geojson/abondance.geojson")
//.then(function(response) {
//return response.json();
//})
//.then(function(data) {
//L.geoJSON(data).addTo(map);
//});


var layerGroup = new L.LayerGroup();
layerGroup.addTo(map)

fetch("./../geojson/aop.json")
.then(function(response) {
return response.json();
})
.then(function(data) {
fromages = data;
});


var input = document.getElementById("fromage");
 
autocomplete({
    input: input,
    fetch: function(text, update) {
        text = text.toLowerCase();
        var suggestions = fromages.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
    },
    onSelect: function(item) {
        input.value = item.label;
        var geojson = "./../geojson/" + item.label.toLowerCase()+".geojson"; 
        
        console.log(geojson);
        fetch(geojson)
.then(function(response) {
            console.log(response);
return response.json();
})
.then(function(data) {
         var selected =new L.GeoJSON(data);
            layerGroup.clearLayers();
        layerGroup.addLayer(selected);
            
//L.geoJSON(data).addTo(map);
        
        
        });
    },
    preventSubmit: true
});


document.querySelector("input[id=fromage]").addEventListener( 'change', function() {
    console.log(this.value);
});




document.querySelector("input[name=vache]").addEventListener( 'change', function() {
    if(this.checked) {
        var filtered = fromages.filter(a=>a.lait=="Vache");
        console.log(filtered);
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=chevre]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.lait=="Chèvre");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=brebis]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.lait=="Brebis");
        console.log(filtered);   
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=ppc]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type=="Pâte pressée cuite");
        console.log(filtered);       
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=pmcn]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type=="Pâte molle à croûte naturelle");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=pp]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type==" Pâte persillée");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=pmcf]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type=="Pâte molle à croûte fleurie");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=ff]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type=="Fromage frais");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=ppnc]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type=="Pâte pressée non cuite");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=pmcl]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.type=="Pâte molle à croûte lavée");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=doux]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.gout=="Doux");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=normal]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.gout=="Normal");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=fort]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.gout=="Fort");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=tresfort]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.gout=="Très fort");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("input[name=hardcore]").addEventListener( 'change', function() {
    if(this.checked) {
var filtered = fromages.filter(a=>a.gout=="Hardcore");
        console.log(filtered);    
    } else {
        // Checkbox is not checked..
    }
});

document.querySelector("button[id=reset]").addEventListener( 'click', function() {
  console.log("reset");
     var inputs = document.querySelectorAll("input[type=checkbox]");
    console.log(inputs);
  for (var i = 0; i < inputs.length; i++) {
    console.log(inputs[i]);
    inputs[i].checked = false;
  }
});