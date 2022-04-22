let VER = '0.0.15';
let CACHE_NAME = 'cache_'+VER; // An unique name in origin scope, 
                               // see https://www.w3.org/TR/service-workers-1/#dfn-relevant-name-to-cache-map

let SITE_FILES = [
    '/icon.png',
    '/index.html',
    '/index.js'
];

function log(...args) {
    console.log(`[sw.js ${VER}]`, ...args);
}

async function doInstall() {
    try {
        let cache = await caches.open(CACHE_NAME);
        // let oldkeys = await cache.keys();
        // console.log('cache before install:', oldkeys);
        let result = await cache.addAll(SITE_FILES);
        let keys = await cache.keys();
        console.log('cache after install:', keys);
        return result;
    } catch(err) {
        return err;
    }
    
}
self.addEventListener('install', (e) => {
    console.log(`[sw.js ${VER}] Install `, e);
    e.waitUntil(doInstall());
});

// delete old cache prevent storage leak
async function doActivate() {
    try {
        let names = await caches.keys();
        for(let name of names) {
            if(name != CACHE_NAME) {
                await caches.delete(name);
                log('deleted old cache '+name);
            }
            
        }
        return;
    } catch(err) {
        return err;
    }
}

self.addEventListener('activate', (e) => {
    console.log(`[sw.js ${VER}] Activate `, e);
    e.waitUntil(doActivate());
});

async function onFetch(evt) {
    console.log("onFetch ", JSON.stringify(evt.request, null, '\t'));
    let resp = await caches.match(evt.request);
    if(resp) {
        log('hit cache ', evt.request.url, resp);
        return resp;
    } else {
        // default go to network
        log('missed in cache', evt.request.url);
    }
}
self.addEventListener('fetch', (e) => {
    console.log(`[sw.js ${VER}] Fetch `, e);
    e.respondWith(onFetch(e));
});

async function handleMessage(client, cmd) {
    if(cmd.type == "VER") {
        client.postMessage(JSON.stringify({"type":"VER", "value":VER}));
    }
}

self.addEventListener("message", (e) => {
    let cmd = JSON.parse(e.data);
    log("received command from navigator:", e);
    e.waitUntil(handleMessage(e.source, cmd));
    
})