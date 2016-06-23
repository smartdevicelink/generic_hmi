import { combineReducers } from 'redux';
import { Actions } from './actions';

// expected format of appList:

function appList(state = [], action) {
    switch (action.type) {
        case Actions.UPDATE_APP_LIST:
            return action.appList
        default:
            return state
    }
}

function activeApp(state = null, action) {
    switch (action.type) {
        case Actions.ACTIVATE_APP:
            return { ...state, activeApp: action.activeApp }
        default:
            return state
    }
}

export const hmi = combineReducers({
    appList,
    activeApp
})