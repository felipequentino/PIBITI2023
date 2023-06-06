if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.log('Service Worker not registered', err));
}
// service worker para cache, para que o app funcione offline e que seja instalavel no celular (PWA)