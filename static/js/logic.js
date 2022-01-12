async function main(){
const queryurl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const response =  await fetch(queryurl);
data = await response.json()

features= data.features

console.log(features)

// create markers

quakemarkers=[];

for (i=0; i < features.length; i++) {

    var earthquake= features[i];
    var mag= earthquake.properties.mag;
    var dep= earthquake.geometry.coordinates[2];
    // https://www.w3docs.com/snippets/javascript/how-to-get-a-timestamp-in-javascript.html to convert timestamp
    var timestamp = earthquake.properties.time;
    var date= new Date(timestamp);
    console.log(date.getTime()) 
    console.log(date)   
    // console.log("earthquake", earthquake);
    // console.log("dep", dep);
    // console.log("mag", mag);
    var color= "";
    
    switch(true){
    case (dep >= -10 && dep <= 10) :
        color = '#00FF00' //green
      break;
    case (30 >= dep && dep>= 10) :
        color = '#FFFF00' //yellow
      break;
    case (50 >= dep && dep>= 30):
        color = '#FF7F50' //yellow orange 
      break;
    case (70>= dep && dep>= 50) :
        color = '#FFA500' //  orange
      break;
    case (90>= dep && dep >= 70) :
        color = '#FF8C00' // dark orange
      break;
    case (dep >= 90):
        color = '#FF0000' //red
        break;
      }
      // Add circles to the map.
    qmarkers= L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
    opacity:.5,
    fillOpacity: 0.75,
    color: color,
    fillColor: color,
    // Adjust the radius.
    radius: mag * 5000
  }).bindPopup("<h1>" + "Earthquake Name: " +earthquake.properties.title + "<br>" +"<hr>"+
  "Magnitude: " + mag + "<hr>" + "Depth: " +dep +" km" + "<hr>" + "<p>" + date + "</p>")

//   qmarkers=L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]])
//   .bindPopup("<h1>" + earthquake.properties.title+ "<h1>"+ "<br>" + "<h3>" + "Magnitude: " + mag + "</h3>" +
//    + "<h3>" + "Depth: " + dep + "</h3>");

  quakemarkers.push(qmarkers)}

  var earthquakelayer= L.layerGroup(quakemarkers);

  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

var overlayMaps= {
    Earthquakes: earthquakelayer
}
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakelayer]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

//create the legend
//https://gis.stackexchange.com/questions/258335/leaflet-create-legend
//https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map

var legend= L.control({position: 'bottomright'});

legend.onAdd=function(myMap){
    var div=L.DomUtil.create('div','legend');
    var grades=[
        "-10-10", "10-30", "30-50", "50-70", "70-90", "90+"
    ];
    var colors= [
        '#00FF00', '#FFFF00', '#FF7F50', '#FFA500', '#FF8C00', '#FF0000'
    ];

    //create title
    var legendtitle="<h1> Earthquake Depth (km)</h1>" + "div class=\labels\">"+ "</div>";
    div.innerHTML=legendtitle
    
    var labels=[];

    colors.forEach(function(color, index){
        labels.push("<li style=\"background-color: " + color + '\">'+  grades[index] + "</li>");
    })
    div.innerHTML =labels.join('<br>');
    console.log(labels)
    return div;
}

legend.addTo(myMap)


}

main()