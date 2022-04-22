


document.addEventListener('DOMContentLoaded', () => {
    console.log('try register serviceWorker...');
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => {
                console.log('Service worker registered:', reg);
                console.log('Service worker installing ', reg.installing);
                console.log('Service worker waiting ', reg.waiting);
                console.log('Service worker active ', reg.active);
                if(reg.active) {
                    reg.active.postMessage(JSON.stringify({"type":"VER"}));
                    reg.active.onerror = (ev) => {
                        console.log("Service worker active error:", ev);
                    }
                }
                if(reg.installing) {
                    reg.installing.onerror = (ev) => {
                        console.log("Service worker installing error:", ev);
                    }
                }
                if(reg.waiting) {
                    reg.waiting.onerror = (ev) => {
                        console.log("Service worker waiting error:", ev);
                    }
                }
                
            }, (err) => {
                console.error('Service worker registered error:', 
                    err);
            });
        navigator.serviceWorker.onmessage = (ev) => {
            let cmd = JSON.parse(ev.data);
            console.log("received message from sw:", cmd);
            if(cmd.type == "VER") {
                document.getElementById("text-version").innerHTML = cmd.value;
            }
        }
    } else {
        console.error('Browser not support service worker!!!');
    }
});