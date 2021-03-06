async function main(){
const queryurl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const response =  await fetch(queryurl);
data = await response.json()

features= data.features

console.log(features)

// create markers using array

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
    
//'#CCFFCC' , '#99FF99', '#80FF00', '#00CC00', '#009900', '#006633'

    var color= "";
    // use switch function to find variables with corresponding values
    switch(true){
      case (dep >= -10 && dep <= 10) :
          color = '#CCCC00'
        break;
      case (30 >= dep && dep>= 10) :
          color = '#80FF00' 
        break;
      case (50 >= dep && dep>= 30):
          color = '#00CC00' 
        break;
      case (70>= dep && dep>= 50) :
          color = '#009900'
        break;
      case (90>= dep && dep >= 70) :
          color = '#006633'
        break;
      case (dep >= 90):
          color = '#003319'
          break;
        }
      // Add circles to the map.
    qmarkers= L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
    opacity:.5,
    fillOpacity: 0.75,
    color: color,
    fillColor: color,
    // Adjust the radius.
    radius: mag * 3500
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
        "-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"
    ];
    var colors= [
        '#CCCC00', '#80FF00', '#00CC00', '#009900', '#006633', '#003319'
        
    ];

    //create title
    var legendtitle="<h4> Earthquake Depth (km)</h4>";
    div.innerHTML=legendtitle
    
    // create labels array for legend values
    var labels=[];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
         grades[i] + (grades[i + 1] ? ""  + "<br>" : "");
        }
        return div;
      };


legend.addTo(myMap)


}

main()