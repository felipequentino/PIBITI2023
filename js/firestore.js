import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
// insira as configurações do seu projeto aqui
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

var latitude;
var longitude;

navigator.geolocation.getCurrentPosition(function(position) {
    // A posição atual do usuário está disponível em position.coords.latitude e position.coords.longitude
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  

  console.log(latitude, longitude)
  // Sucesso
}, function(error) {
  // Erro
  switch (error.code) {
    case error.PERMISSION_DENIED:
      // Permissão negada pelo usuário
      break;
    case error.POSITION_UNAVAILABLE:
      // Posição indisponível
      break;
    case error.TIMEOUT:
      // Tempo limite expirado
      break;
    case error.UNKNOWN_ERROR:
      // Erro desconhecido
      break;
  }
});


$('#add-marker-btn').click(function () {
  $('#option-dialog').modal().modal('open');
});

$('#add-real-location-marker-btn').click(function () {
  $('#crime-dialog').modal({
    onOpenEnd: function () {
      // Initialize the select box
      $('select').formSelect();

      // Remove the previous click event before adding a new one
      $('#add-marker-btn-dialog').off('click').on('click', function () {
        // Generate a unique ID with the current date and time for the document
        var now = new Date();
        var id = $('#crime-select').val() + '-' + now.toISOString();

        // Add the coordinates and ID to Firestore
        addDoc(collection(db, "teste"), {
            id: id,
            lat: latitude,
            lng: longitude,
            crime: $('#crime-select').val()
          })
          .then((docRef) => {
            console.log("Coordinates added successfully:", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding coordinates:", error);
          });

        $('#crime-dialog').modal('close');
      });
    }
  }).modal('open');
});

$('#add-clicked-location-marker-btn').click(function () {
  map.on('click', function(e) {
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;

    $('#crime-dialog').modal({
      onOpenEnd: function() {
        // inicializa a caixa de seleção
        $('select').formSelect();

        // remove o evento de clique anterior antes de adicionar um novo
        $('#add-marker-btn-dialog').off('click').on('click', function() {
          // gera um ID único com a data e hora atual para o documento
          var now = new Date();
          var id = $('#crime-select').val() + '-' + now.toISOString();

          // adiciona as coordenadas e o ID ao firestore
          addDoc(collection(db, "teste"), {
            id: id,
            lat: lat,
            lng: lng,
            crime: $('#crime-select').val()
          })
          .then((docRef) => {
            console.log("Coordenadas adicionadas com sucesso:", docRef.id);
            $('#crime-dialog').modal('close');
          })
          .catch((error) => {
            console.error("Erro ao adicionar as coordenadas:", error);
          });
        });
      }
    }).modal('open');
  });
});
// realiza uma consulta no firestore e retorna todos os documentos da coleção "teste"
const querySnapshot = await getDocs(collection(db, "teste"));
// Criar um LayerGroup para os marcadores
const markersLayerGroup = L.layerGroup().addTo(map);


// função que itera sobre o banco de dados e adiciona os marcadores ao mapa
function busca_cords(iconSize) {
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.lat && data.lng) {
        const coords = new L.LatLng(data.lat, data.lng);
        let iconName;

        if (data.id.includes('MausTratos')) {
            iconName = 'maustratos.png';
        } else if (data.id.includes('Poluicao')) {
            iconName = 'poluicao.png';
        } else if (data.id.includes('Desmatamento')) {
            iconName = 'desmatamento.png';
        } else {
            iconName = 'queimada.png';
        }

        const icon = L.icon({
            iconUrl: `../img/${iconName}`,
            iconSize: iconSize
        });

        const marker = L.marker(coords, { icon });
        marker.bindPopup(doc.id);
        markersLayerGroup.addLayer(marker); // Adicionar o marcador ao LayerGroup
    }
  });
}


busca_cords([100,100])

map.on('zoomend', function() {
  var currentZoom = map.getZoom();
  var newIconSize;

  // Ajustar o tamanho do ícone com base no nível de zoom
  if (currentZoom <= 5) {
    newIconSize = [40, 40]; 
  } else if (currentZoom > 5 && currentZoom <= 7) {
      newIconSize = [52, 52]; 
  } else if (currentZoom > 7 && currentZoom <= 10) {
      newIconSize = [65, 65]; 
  } else if (currentZoom > 10 && currentZoom <= 12) {
      newIconSize = [80, 80]; 
  } else if (currentZoom > 12 && currentZoom <= 14) {
      newIconSize = [100, 100]; 
  } else if (currentZoom > 14 && currentZoom <= 16) {
      newIconSize = [120, 120]; 
  } else if (currentZoom > 16 && currentZoom <= 18) {
      newIconSize = [140, 140]; 
  } else {
      newIconSize = [170, 170]; 
  }

  // Limpar todos os marcadores existentes
  markersLayerGroup.clearLayers();
  busca_cords(newIconSize)

});


