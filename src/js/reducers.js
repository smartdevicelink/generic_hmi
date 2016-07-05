import { combineReducers } from 'redux';
import { Actions } from './actions';

function newAppState () {
    return {
        showStrings: [],
        graphic: null,
        softButtons: [],
        icon: null,
        menu: []
    }
}

function appList(state = [], action) {
    switch (action.type) {
        case Actions.UPDATE_APP_LIST:
            var newState = action.appList.map((app, index) => {
                // If there is on icon on the app in the current list, transfer it over
                var match = state.find((test) => {
                    return app.appID === test.appID
                })
                if (match) {
                    app.icon = match.icon
                }
                return app
            })
            return newState
        case Actions.SET_APP_ICON:
            var newState = state.map((app, index) => {
                if (app.appID === action.appID) {
                    return { ...app, icon: action.icon.value }
                } else {
                    return { ...app }
                }
            })
            return newState
        default:
            return state
    }
}
function activeApp(state = null, action) {
    switch (action.type) {
        case Actions.ACTIVATE_APP:
            return action.activeApp
        default:
            return state
    }
}
function ui(state = {}, action) {
    switch (action.type) {
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
        case Actions.SET_APP_ICON:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            app.icon = action.icon
            return newState
        case Actions.ADD_COMMAND:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            var menu = app.menu
            var menuParams = action.menuParams
            var cmdID = action.cmdID
            var cmdIcon = action.cmdIcon
            if (menuParams.parentID) {
                var subMenu = menu.find((command) => {
                    return command.menuID === menuParams.parentID
                })
                subMenu.subMenu.push({
                    cmdID: cmdID,
                    parentID: menuParams.parentID,
                    position: menuParams.position,
                    menuName: menuParams.menuName,
                    cmdIcon: cmdIcon
                })
                subMenu.subMenu.sort((a, b) => {
                    return a.position - b.position
                })
            } else {
                menu.push({
                    cmdID: cmdID,
                    parentID: menuParams.parentID,
                    position: menuParams.position,
                    menuName: menuParams.menuName,
                    cmdIcon: cmdIcon
                })
                menu.sort((a, b) => {
                    return a.position - b.position
                })
            }
            return newState
        default:
            return state
    }
}

export const hmi = combineReducers({
    appList,
    activeApp,
    ui
})