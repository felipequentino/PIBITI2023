var map = L.map('map').setView([-10.874441869131706, -37.078545271987174], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// inicialize o mapa



function updateMap(tipoCrime, ano) {
  Promise.all([
    fetch('/data/teste2.geojson').then(response => response.json()), // geojson dos bairros
    fetch('/data/crimes.json').then(response => response.json()), // dados dos crimes dos bairros
  ]).then(([geoJsonData, crimeData]) => {
    // remove layers antigos do mapa
    map.eachLayer(layer => { if (layer instanceof L.GeoJSON) layer.remove() });
    // adiciona a nova layer
    L.geoJSON(geoJsonData, {
      style: function(feature) {
        var crime = crimeData.find(el => el.name === feature.properties.name);
        
        var occurrence = 0;
        if (crime) {
          var selectedCrime = crime.crime.find(el => el.type === tipoCrime);
          if(selectedCrime != null) { 
            occurrence = selectedCrime.year[ano] || 0; 
          }        
        }
      
        var fillColor, borderColor;
        if (occurrence > 60) {
          fillColor = "#bd0026";
        } else if (occurrence > 30) {
          fillColor = "#f03b20";
        } else if (occurrence > 15) {
          fillColor = "#fd8d3c";
        } else if (occurrence > 7) {
          fillColor = "#feb24c";
        } else if (occurrence > 2) {
          fillColor = "#fed976";
        } else if (occurrence > 0){
          fillColor = "#ffffb2"
        } else {
          fillColor = "transparent" // nenhum crime
        }
      
        // cor da borda com uma transparencia maior
        borderColor = fillColor.replace(")", ", 0.5)").replace("rgb", "rgba");
      
        return { 
          fillColor: fillColor, 
          fillOpacity: 0.8, 
          color: borderColor, 
          weight: 2 
        };
      },
      
      onEachFeature: function(feature, layer) {
        
        // bairros da zona de expansao
        var expansionZones = [
          "Aruanda",
          "Robalo",
          "São José dos Náufragos",
          "Areia Branca",
          "Gameleira",
          "Matapoã",
          "Mosqueiro"
        ];
        
        var crime = crimeData.find(el => el.name === feature.properties.name);
        if (crime) {          
          var isExpansionZone = expansionZones.includes(crime.name);
          // caso o bairro faça parte da zona de expansão, o nome do bairro exibido será zona de expansão
          var crimeName = isExpansionZone ? 'Zona de expansão' : crime.name;
          var popupContent = `<h2>${crimeName}</h2>`;
          if (isExpansionZone) {
            popupContent += `<h5>Bairro: ${crime.name}</h5>`;
          } 
          for (var i = 0; i < crime.crime.length; i++) {
            popupContent += `<p><strong>${crime.crime[i].type}</strong>: ${crime.crime[i].year.total} ocorrências</p>`;
          }
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(map);
  });
}

// função pra atualizar o crime de acordo com as caixas de seleção
function getCrimeData() {
  const crimeSelect = document.getElementById("crimes-select");
  const anosSelect = document.getElementById("anos-select");

  const crimeSelecionado = crimeSelect.value;
  const anosSelecionados = anosSelect.value;
  updateMap(crimeSelecionado, anosSelecionados);
}

// evento de mudança nas caixas de seleção
document.getElementById("crimes-select").addEventListener("change", getCrimeData);
document.getElementById("anos-select").addEventListener("change", getCrimeData);
