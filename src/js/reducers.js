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
        // type: Actions.SHOW,
        // appID: appID,
        // showStrings: showStrings,
        // graphic: graphic,
        // softButtons: softButtons
function ui(state = {activeApp: null}, action) {
    switch (action.type) {
        case Actions.ACTIVATE_APP:
            return { ...state, activeApp: action.activeApp }
        case Actions.SHOW:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : {
                showStrings: null,
                graphic: null,
                softButtons: null
            }
            newState[action.appID] = app
            if (action.showStrings) {
                app.showStrings = action.showStrings
            }
            if (action.graphic) {
                app.graphic = action.graphic
            }
            if (action.softButtons) {
                app.softButtons = action.softButtons
            }
            return newState
        default:
            return state
    }
}

export const hmi = combineReducers({
    appList,
    ui
})