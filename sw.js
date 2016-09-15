function handleInstall(event) {
    console.log('installed');
    // not caching anything yet
    self.skipWaiting();
}

function handleActivate(event) {
    event.waitUntil(self.clients.claim());
}

// Getting a bunch of this from this SW cookbook:
// https://serviceworke.rs/message-relay_service-worker_doc.html

// Pass on the action creator to all listening clients
function handleMessage(event) {
    // Get all connected clients and forward the message along
    const promise = self.clients.matchAll().then(clientList => {
        // event.source.id contains the ID of the sender of the message. event in Chrome isn’t an
        // ExtendableMessageEvent yet
        // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#extendablemessage-event-interface),
        // so it doesn’t have the source property. https://code.google.com/p/chromium/issues/detail?id=543198
        const senderId = event.source ? event.source.id : 'unknown';

        if (!event.source) {
            console.log('event source is null; we don\'t know the sender of the message');
        }

        clientList.forEach(client => {
            // Skip sending the message to the client that sent it.
            if (client.id === senderId) {
                return;
            }

            // Add a client id to the action to check in the
            // middleware so we don't end up in a loop 🌀
            const data = Object.assign({}, event.data, { swClient: client.id });

            client.postMessage({
                client: senderId,
                message: data
            });
        });
    });


    // If event.waitUntil is defined (not yet in Chrome because of the same issue detailed before),
    // use it to extend the lifetime of the Service Worker.
    if (event.waitUntil) {
        event.waitUntil(promise);
    }
}

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);
