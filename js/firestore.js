import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";


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
  
// Evento de click do mapa para adicionar um marcador no servidor
map.on('click', function(e) {
    $('#crime-dialog').modal({
      onOpenEnd: function() {
        // Inicializa a caixa de seleção
        $('select').formSelect();
  
        // Remove o evento de clique anterior antes de adicionar um novo
        $('#add-marker-btn-dialog').off('click').on('click', function() {
          var coord = e.latlng;
          var lat = coord.lat;
          var lng = coord.lng;
  
          // gera um ID único com a data e hora atual para o documento
          var now = new Date();
          var id = $('#crime-select').val() + '-' + now.toISOString();
  
          // Adiciona as coordenadas e o ID ao firestore
          addDoc(collection(db, "teste"), {
              id: id,
              lat: lat,
              lng: lng,
              crime: $('#crime-select').val()
          })
          .then((docRef) => {
              console.log("Coordenadas adicionadas com sucesso:", docRef.id);
          })
          .catch((error) => {
              console.error("Erro ao adicionar as coordenadas:", error);
          });
          $('#crime-dialog').modal('close');
        });
      }
    }).modal('open');
  });
  
  


// realiza uma consulta no firestore e retorna todos os documentos da coleção "teste"
const querySnapshot = await getDocs(collection(db, "teste"));
  
// percorre os documentos retornados e adiciona um marcador no mapa para cada um
querySnapshot.forEach((doc) => {
  const data = doc.data();
  if (data.lat && data.lng) {
    const coords = new L.LatLng(data.lat, data.lng);
    let iconName;

    // define o ícone de acordo com o crime
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
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76]
    });

    const marker = L.marker(coords, { icon }).addTo(map);
    marker.bindPopup(doc.id);
  }
});

