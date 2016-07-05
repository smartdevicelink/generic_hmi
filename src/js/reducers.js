import { combineReducers } from 'redux';
import { Actions } from './actions';

function newAppState () {
    return {
        showStrings: null,
        graphic: null,
        softButtons: null,
        icon: {
            imageType: null,
            value: null
        }
    }
}

// expected format of appList:
    // var data = state.appList.map ((app, index) => {
    //     console.log(app.icon.value)
    //     return {
    //         id: app.appID,
    //         class: 'with-image',
    //         name: app.appName,
    //         image: app.icon.value,
    //         link: '/media'
    //     }
    // })


function appList(state = [], action) {
    switch (action.type) {
        case Actions.UPDATE_APP_LIST:
            return action.appList
        case Actions.SET_APP_ICON:
            var newState = state.map((app, index) => {
                if (app.appID === action.appID) {
                    return { ...app, icon: action.icon }
                } else {
                    return { ...app }
                }
            })
            return newState
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
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
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