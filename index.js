
let version = "v1";

document.addEventListener('DOMContentLoaded', () => {
    console.log('try register serviceWorker...');
    document.getElementById('page-version').innerHTML = version;
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
                    reg.active.onstatechange = (ev) => {
                        console.log("Service worker state changed:", ev);
                    }
                }
                if(reg.installing) {
                    reg.installing.onerror = (ev) => {
                        console.log("Service worker installing error:", ev);
                    }
                    reg.installing.onstatechange = (ev) => {
                        console.log("Service worker state changed:", ev);
                    }
                }
                if(reg.waiting) {
                    reg.waiting.onerror = (ev) => {
                        console.log("Service worker waiting error:", ev);
                    }
                    reg.waiting.onstatechange = (ev) => {
                        console.log("Service worker state changed:", ev);
                    }
                }
                reg.onupdatefound = (ev) => {
                    console.log("Service worker has a new version:", ev);
                    if(confirm("Has a new version, do u want update immediatly?")) {
                        reg.installing.postMessage(
                            JSON.stringify({"type":"SKIP_WAITING"}));
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
        navigator.serviceWorker.onerror = (ev) => {
            console.log("Service worker occured error:", ev);
        }
        let refreshing = false;
        navigator.serviceWorker.oncontrollerchange = (ev) => {
            console.log("Service worker changed:", ev);
            if(refreshing) {
                return;
            }
            refreshing = true;
            window.location.reload();
        }
        navigator.serviceWorker.onmessageerror = (ev) => {
            console.log("Service worker sent message error:", ev);
        }
        

    } else {
        console.error('Browser not support service worker!!!');
    }

    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else {
        console.log("This browser support desktop notification")
    }
});