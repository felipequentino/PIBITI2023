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

let downloadURL;
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
    
    // adiciona o marcador no mapa e a imagem, caso exista
    const marker = L.marker(coords, { icon }).addTo(map);
    if (data.urlStorage == '') {
      marker.bindPopup("Sem imagem");
    } else {
    marker.bindPopup(`<img src="${data.urlStorage}" height="150px" width="150px"/>`);
    }
  }
});

// função para salvar a imagem no storage - Firebase código
async function saveImage(file) {
  try {
    // 1 - Upload the image to Cloud Storage.
    const storage = getStorage();
    const filePath = `imagens/${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytesResumable(storageRef, file);

    // 2 - Generate a public URL for the file.
    downloadURL = await getDownloadURL(storageRef);
    console.log("File uploaded to Firebase Storage. Download URL:", downloadURL);
  } catch (error) {
    console.error('There was an error uploading a file to Firebase Storage:', error);
  }
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  saveImage(file);
}

map.on('click', function(e) {
  $('#photo-dialog').modal({
    onOpenEnd: function() {
      $('#confirm-photo').off('click').on('click', function() {
        if ($('#yes-photo').is(':checked')) {
          mediaCaptureElement.click();
        } else if ($('#no-photo').is(':checked')) {
          downloadURL = '';
          // TODO: FECHAR MODAL
        }

        $('#photo-dialog').modal('close');

        // Após fechar a primeira caixa modal, abre a segunda caixa modal
        $('#crime-dialog').modal({
          onOpenEnd: function() {
            // inicializa a caixa de seleção
            $('select').formSelect();

            // remove o evento de clique anterior antes de adicionar um novo
            $('#add-marker-btn-dialog').off('click').on('click', function() {
              var coord = e.latlng;
              var lat = coord.lat;
              var lng = coord.lng;
              var urlStorage = downloadURL;

              // gera um ID único com a data e hora atual para o documento
              var now = new Date();
              var id = $('#crime-select').val() + '-' + now.toISOString();

              // adiciona as coordenadas e o ID ao firestore
              addDoc(collection(db, "teste"), {
                id: id,
                lat: lat,
                lng: lng,
                urlStorage: urlStorage,
                crime: $('#crime-select').val()
              })
              .then((docRef) => {
                console.log("Coordenadas adicionadas com sucesso:", docRef.id);
                $('#crime-dialog').modal('close');
                urlStorage = '';
              })
              .catch((error) => {
                console.error("Erro ao adicionar as coordenadas:", error);
              });
            });
          }
        }).modal('open');
      });
    }
  }).modal('open');
});


//shortcuts for DOM elements
var imageButtonElement = document.getElementById('submitImage');
var mediaCaptureElement = document.getElementById('mediaCapture');
var imageFormElement = document.getElementById('image-form');

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

