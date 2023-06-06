var map = L.map('map').setView([-10.874441869131706, -37.078545271987174], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//inicializa o mapa

var heat = L.heatLayer([
	[-10.878187471412927, -37.088210573458326, 0.2], // lat, lng, intensity
	[-10.874441869131706, -37.078545271987174, 1]
], {radius: 25}).addTo(map);
var circulo = L.circle([-10.878187471412927, -37.088210573458326], {color: 'red'}).addTo(map);
circulo.bindPopup("Área de mangue</b><br>cercada e loteada");
// teste de ponto de calor e circulo

/* map.on('click', function(e){

    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    markerClient = L.marker([lat, lng]).addTo(map);
}); */

