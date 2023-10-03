// store API endpoint inside queryUrl
let queryUrl = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
// Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
}
);

// Set up map
let myMap = L.map("map", {
    center: [35.4, -119.4],
    zoom: 6.5
});

// Tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);

function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#E99000d";
        case depth > 70:
            return "#3f3b2c";
        case depth > 50:
            return "#2ca25f";
        case depth > 30:
            return "#f330d2";
        case depth > 10:
            return "#fff5f0";
        default:
            return "#98EE00";
    }     
}

 //  Circle creation
for (let i = 0; i < features.length; i++) {
    // Searching for null or naan magnitude
    if (features[i].properties.mag === null || isNaN(features[i].properties.mag) || features[i].properties.mag < 0.001) {
    continue;
    }
    let geometry = features[i].geometry;
    let properties = features[i].properties;
    let depth = geometry.coordinates[2];
    let magnitude = properties.mag;
    //  Date setup 
    let date = new Date(properties.time).toLocaleDateString("en-US");
    let eventURL = properties.url;

    L.geoJSON(earthquakeData, {
    
        pointToLayer: function (feature,latlng){
            return L.circleMarker(latlng)
            },
        style: function style(feature){
            return{radius: size(feature.properties.mag),
                fillColor: color(feature.geometry.coordinates[2]),
                color: "white",
                weight: 0.5,
                opacity: 0.8,
                fillOpacity: 0.8}
            },
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude:${feature.properties.mag}</p>`);
}
}).addTo(myMap)
    
// Set up legend on the map
    let legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            depth = [90, 70, 50, 30, 10, -10],
            labels = [];
    
// loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + color(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
}

    return div;
    };
    
    legend.addTo(myMap);
    
    }