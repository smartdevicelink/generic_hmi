const url = "ws://localhost:8087"
let socket;

// Service Worker install event
function handleInstall(event) {
    // not caching anything
    event.waitUntil(self.skipWaiting());
}

// Service Worker Activate event
function handleActivate(event) {
    // Claim all clients currently in scope
    event.waitUntil(self.clients.claim());
}

// Open socket connection to SDL
function connectToSocket() {
    return new Promise(resolve => {
        if(!socket || socket.readyState === socket.CLOSED) {
            socket = new WebSocket(url);
            socket.onopen = () => {
                resolve('Connected to SDL socket');
            }
            socket.onmessage = onSocketMessage;
        } else {
            resolve('Existing socket connection');
        }
    });
}

// Send message to socket connection
function sendToSocket(rpc) {
    socket.send(rpc);
}

function disconnectFromSocket() {
    if (socket) {
        if(socket.readyState === socket.OPEN) {
            socket.onclose = function () {
                socket.close();
            }
        }
    }
}

function checkClientsAndCloseSocket() {
    self.clients.matchAll().then(clientList => {
        if (clientList.length === 1) {
            disconnectFromSDL();
        }
    });
}

// Post message to all connected clients
// https://serviceworke.rs/message-relay_service-worker_doc.html
function broadcast(data) {
    // Get all connected clients and forward the message along
    self.clients.matchAll().then(clientList => {
        // event.source.id contains the ID of the sender of the message
        const senderId = data.source ? data.source.id : 'unknown';

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
}

// Handle messages from the socket connection
function onSocketMessage(evt) {
    const rpc = JSON.parse(evt.data)
    broadcast(rpc);
}

// Handle messages to the serviceWorker
function handleClientMessage(event) {
    switch (event.data.type) {
        case 'SW_CONNECT_SDL':
            connectToSocket().then(res => {
                // Send a success reply to the connect request which passed a message port
                event.ports[0].postMessage(res);
            });
            break;
        case 'SW_REGISTER_COMPONENTS':
            registerComponents();
            break;
        case 'SW_SEND_TO_SDL':
            sendToSocket(event.data.data);
            break;
        case 'SW_CLOSE_SDL_CONNECTION':
            checkClientsAndCloseWS();
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
self.addEventListener('message', handleClientMessage);
self.addEventListener('fetch', handleFetch);
