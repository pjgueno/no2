# NO2 Map

A leaflet map for the NO2 tube campaign @Sensor.Community 

The data is a geojson with a FeatureCollection.
{"type":"FeatureCollection","features":[]}

Each feature has such structure :
{"type":"Feature","geometry":{"type":"Point","coordinates":[35.0517,48.46709]},"properties":{"tubeId":"DNK1","resultId":"2337","value":32.149,"link":"https://www.savednipro.org/","group":"SaveDnipro","city":"Dnipro","height":2.5,"trafic":1,"info":"Shopping mall \"MOST-City\", bus station, entrance to the \"Central bridge\"","ostation":0,"remark":""}}


The cordinates are in the order [lon,lat].

The map loads some geojson for the cities. 

The EEA official station are loaded from the API described in data/config.json and parsed.

Further official stations in Budapest and Minsk are also loaded from geojson.

Russian official stations are loaded from a request on an API.

"npm start" to open the map in a virtual server.

"npm run build" to make the dist.

Don't forget to update the path of the json files in the main.js and copy those file from the json folder.