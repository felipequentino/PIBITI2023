// install service worker
self.addEventListener('install', evt => {
    console.log('Service worker installed');
});

// activate service worker
self.addEventListener('activate', evt => {
    console.log('Service worker activated');
});

self.addEventListener('fetch', function(event) {})