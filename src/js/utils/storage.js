import { fromJS } from 'immutable';
import { SDL_HMI_STORAGE } from '../constants';

const ignoredKeys = ['routing'];

const dummyStorage = {
    setItem: () => undefined,
    getItem: () => undefined
};

function storageTest(storage) {
    const testKey = 'test';
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

function getSupportedStorage() {
    if (storageTest(window.localStorage)) {
        return window.localStorage;
    } else if (storageTest(window.sessionStorage)) {
        return window.sessionStorage;
    }
    return dummyStorage;
}

const storage = getSupportedStorage();

export default {
    get(key) {
        const item = storage.getItem(key);

        try {
            return JSON.parse(item);
        } catch (e) {
            // console.warn('Unable to pull from localstorage: ', e);
            return false;
        }
    },

    set(key, value) {
        const json = JSON.stringify(value);
        storage.setItem(key, json);
    },

    remove(key) {
        storage.removeItem(key);
    },

    clear() {
        storage.removeItem(SDL_HMI_STORAGE);
    }
};

export function cleanState(state) {
    return Object.keys(state).reduce((obj, key) => {
        if (ignoredKeys.indexOf(key) > -1) {
            return obj;
        }
        let chunk = state[key];
        // not using immutable
        // if (chunk.toJS) {
        //     chunk = chunk.toJS();
        // }
        const newObj = obj;
        newObj[key] = chunk;
        return newObj;
    }, {});
}

function isObject(obj) {
    return obj === Object(obj);
}

export function immutableState(state) {
    if (!state) {
        return {};
    }
    return Object.keys(state).reduce((obj, key) => {
        const chunk = state[key];
        const newObj = obj;
        if (Array.isArray(chunk) || isObject(chunk)) {
            newObj[key] = fromJS(chunk);
        } else {
            newObj[key] = chunk;
        }
        return newObj;
    }, {});
}
