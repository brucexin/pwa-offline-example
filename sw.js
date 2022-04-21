let VER = '0.0.1';

SITE_FILES = [
    '/icon.png',
    'index.html',
    'index.js'
]

self.addEventListener('install', (e) => {
    console.log('[sw.js] Install ', e);
});

self.addEventListener('activate', (e) => {
    console.log('[sw.js] Activate ', e);
});

async function onFetch(evt) {
    return await fetch(evt.request);
}
self.addEventListener('fetch', (e) => {
    console.log('[sw.js] Fetch ', e);
    e.respondWith(onFetch(e));
});