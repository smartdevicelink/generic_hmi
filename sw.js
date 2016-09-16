const url = "ws://localhost:8087"
let socket;

function handleSocketMessage(e) {
    console.log(e);
}

function send(rpc) {
    console.log("outgoing rpc", rpc)
    var jsonString = JSON.stringify(rpc);
    socket.send(jsonString);
}

function subscribeToNotification (notification) {
    var obj = {
        "jsonrpc": "2.0",
        "id": -1,
        "method": "MB.subscribeTo",
        "params": {
            "propertyName": notification
        }
    }
    send(obj)
}

function registerComponents() {
    var JSONMessage = {
        "jsonrpc": "2.0",
        "id": -1,
        "method": "MB.registerComponent",
        "params": {
            "componentName": "UI"
        }
    };
    send(JSONMessage);
    JSONMessage.params.componentName = "BasicCommunication";
    send(JSONMessage);
    JSONMessage.params.componentName = "Buttons";
    send(JSONMessage);
    JSONMessage.params.componentName = "VR";
    send(JSONMessage);
    JSONMessage.params.componentName = "TTS";
    send(JSONMessage);
    JSONMessage.params.componentName = "Navigation";
    send(JSONMessage);
    JSONMessage.params.componentName = "VehicleInfo";
    send(JSONMessage);
    var ready = {
        "jsonrpc": "2.0",
        "method": "BasicCommunication.OnReady"
    }
    send(ready);
    // register for all notifications
    subscribeToNotification("Buttons.OnButtonSubscription")
    subscribeToNotification("BasicCommunication.OnAppRegistered")
    subscribeToNotification("BasicCommunication.OnAppUnregistered")
    subscribeToNotification("Navigation.OnVideoDataStreaming")
}

function handleSocketOpen(e) {
    registerComponents()
}

function handleInstall(event) {
    console.log('installed', socket);
    // not caching anything
    self.skipWaiting();
}

function handleActivate(event) {
    event.waitUntil(self.clients.claim());
}

function connectToSDL() {
    if(!socket) {
        socket = new WebSocket(url);
    }
    socket.onopen = handleSocketOpen;
    socket.onmessage = onmessage;
}

function broadcast(data) {
    // Get all connected clients and forward the message along
    const promise = self.clients.matchAll().then(clientList => {
        // event.source.id contains the ID of the sender of the message
        const senderId = data.source ? data.source.id : 'unknown';

        if (!data.source) {
            console.log('event source is null; we don\'t know the sender of the message');
        }

        clientList.forEach(client => {
            // If this is a Redux action skip sending the message to the client that sent it.
            // TODO: add isReduxAction to actions sent throught swBroadcaster middleware
            if (data.isReduxAction) {
                if (client.id === senderId) {
                    return;
                }

                // Add a client id to the action to check in the
                // Redux middleware so we don't end up in a loop 🌀
                data = Object.assign({}, data, { swClient: client.id });
            }

            client.postMessage(data);
        });
    });


    // If event.waitUntil is defined (not yet in Chrome because of the same issue detailed before),
    // use it to extend the lifetime of the Service Worker.
    if (data.waitUntil) {
        event.waitUntil(promise);
    }
}

function onmessage(evt) {
    const rpc = JSON.parse(evt.data)
    console.log("incoming rpc to serviceWorker", rpc);
    broadcast(rpc);
}

// Getting a bunch of this from this SW cookbook:
// https://serviceworke.rs/message-relay_service-worker_doc.html

// Pass on the action creator to all listening clients
function handleMessage({ data: event }) {
    switch (event.type) {
        case 'connectToWS':
            connectToSDL();
            break;
        case 'sendToWS':
            socket.send(event.data);
            break;
        default:
            return;
    }
}

function handleFetch(evt) {
    // console.log(evt);
}

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);
self.addEventListener('fetch', handleFetch);
