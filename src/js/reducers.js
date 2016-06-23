import { combineReducers } from 'redux';
import { Actions } from './actions';

function appList(state = [], action) {
    switch (action.type) {
        case Actions.UPDATE_APP_LIST:
            return action.applications
        default:
            return state
    }
}

function activeApp(state = {}, action) {
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