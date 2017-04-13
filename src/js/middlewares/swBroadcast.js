const swBroadcast = store => next => action => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const newAction = Object.assign({}, action, { isReduxAction: true });
        const result = next(newAction);
        if (!action.swClient) {
            navigator.serviceWorker.controller.postMessage(newAction);
        }
        return result;
    }
}

export default swBroadcast;
