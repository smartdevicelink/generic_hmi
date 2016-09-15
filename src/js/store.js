import { createStore, applyMiddleware } from 'redux'
import { hmi } from './reducers'
import { swBroadcast } from './middlewares';
import storage, { cleanState } from './utils/storage';
import { SDL_HMI_STORAGE } from './constants';

export default function configureStore(initialState) {
    const store = createStore(
        hmi,
        initialState,
        applyMiddleware(swBroadcast)
    );

    // Add an event listener to dispatch data passed from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        store.dispatch(event.data.message);
    });

    // Put that stuff in localstorage
    store.subscribe(() => {
        const state = cleanState(store.getState());

        // add timestamp
        state.ts = Date.now();
        storage.set(SDL_HMI_STORAGE, state);
    });

    return store;
}
