import { createStore, applyMiddleware } from 'redux'
import { hmi } from './reducers'
import { swBroadcast } from './middlewares';
import storage, { cleanState } from './utils/storage';
import { SDL_HMI_STORAGE } from './constants';

const TEN_MINUTES = 10 * 60 * 1000;
// Get any stored state if available
let initialState = storage.get(SDL_HMI_STORAGE);
// Make sure it's not older than ten minutes
const valid = initialState ? (Date.now() - initialState.ts) < TEN_MINUTES : false;
if (!initialState || !valid) {
    initialState = undefined;
} else {
    // Reset the timestamp on the storage key
    delete initialState.ts;
}

function configureStore(initialState) {
    const store = createStore(
        hmi,
        initialState,
        applyMiddleware(swBroadcast)
    );

    // Put that stuff in localstorage
    store.subscribe(() => {
        const state = cleanState(store.getState());

        // add timestamp
        state.ts = Date.now();
        storage.set(SDL_HMI_STORAGE, state);
    });

    return store;
}

const store = configureStore(initialState);
export default store;
