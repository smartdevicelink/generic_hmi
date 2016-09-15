const swBroadcast = store => next => action => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        console.log('relaying action to service worker', action);
        const result = next(action);
        if (!action.swClient) {
            navigator.serviceWorker.controller.postMessage(action);
        }
        return result;
    }
}

export default swBroadcast;
