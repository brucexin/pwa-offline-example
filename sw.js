let VER = '0.0.28';
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
        return;
    }
}
self.addEventListener('fetch', (e) => {
    console.log(`[sw.js ${VER}] Fetch `, e);
    e.respondWith(onFetch(e));
});

async function handleMessage(client, cmd) {
    if(cmd.type == "VER") {
        client.postMessage(JSON.stringify({"type":"VER", "value":VER}));
    } else if(cmd.type == "SKIP_WAITING") {
        log("received skipWaiting command");
        self.skipWaiting();
    }
}

self.addEventListener("message", (e) => {
    let cmd = JSON.parse(e.data);
    log("received command from navigator:", e);
    e.waitUntil(handleMessage(e.source, cmd));
})

self.addEventListener("messageerror", (e) => {
    log("received unrecognize message ", e);
})

self.addEventListener("push", (e) => {
    log("received push message ", e);
})

self.addEventListener("sync", (e) => {
    log("received sync message ", e);
})

self.addEventListener("periodicsync", (e) => {
    log("received push message ", e);
})

self.addEventListener("notificationclick", (e) => {
    log("received notificationclick message ", e);
})

self.addEventListener("notificationclose", (e) => {
    log("received notificationclose message ", e);
})

self.addEventListener("backgroundfetchabort", (e) => {
    log("received backgroundfetchabort message ", e);
})

self.addEventListener("backgroundfetchclick", (e) => {
    log("received backgroundfetchclick message ", e);
})

self.addEventListener("backgroundfetchfail", (e) => {
    log("received backgroundfetchfail message ", e);
})

self.addEventListener("backgroundfetchsuccess", (e) => {
    log("received backgroundfetchsuccess message ", e);
})

self.addEventListener("contentdelete", (e) => {
    log("received contentdelete message ", e);
})

self.addEventListener("cookiechange", (e) => {
    log("received cookiechange message ", e);
})

self.addEventListener("paymentrequest", (e) => {
    log("received paymentrequest message ", e);
})

self.addEventListener("canmakepayment", (e) => {
    log("received canmakepayment message ", e);
})

self.addEventListener("abortpayment", (e) => {
    log("received canmakepayment message ", e);
})




