import { createStore } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { hmi } from './reducers'
import localforage from 'localforage';
window.localforage = localforage;
let store = createStore(hmi, undefined, autoRehydrate())
persistStore(store, { storage: localforage });
export default store
