import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { Actions } from './actions';
import './polyfill_find'


function newAppState () {
    return {
        showStrings: [],
        graphic: null,
        softButtons: [],
        icon: null,
        menu: [],
        activeSubMenu: null,
        subscribedButtons: {},
        isPerformingInteraction: false,
        interactionText: "",
        choices: [],
        startTime: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        endTime: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        updateMode: "COUNTUP",
        updateTime: new Date().getTime(),
        pauseTime: new Date().getTime(),
        isDisconnected: false
    }
}

function appList(state = [], action) {
    switch (action.type) {
        case Actions.UPDATE_APP_LIST:
            return action.appList
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
function deleteCommand(commands, cmdID) {
    for (var i = 0; i < commands.length; i++) {
        if (commands[i].cmdID === cmdID) {
            commands.splice(i, 1)
            return commands
        }
        else if (commands[i].subMenu) {
            commands[i].subMenu = deleteCommand(commands[i].subMenu, cmdID)
        }
    }
    return commands
}
function ui(state = {}, action) {
    switch (action.type) {
        case Actions.SHOW:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            if (action.showStrings && action.showStrings.length > 0) {
                app.showStrings = action.showStrings
            }
            if (action.graphic) {
                app.graphic = action.graphic
            }
            if (action.softButtons && action.softButtons.length > 0) {
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
        case Actions.DELETE_COMMAND:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            app.menu = deleteCommand(app.menu, action.cmdID)
            return newState
        case Actions.ADD_SUB_MENU:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            var menu = app.menu
            menu.push({
                menuID: action.menuID,
                parentID: action.menuParams.parentID,
                position: action.menuParams.position,
                menuName: action.menuParams.menuName,
                subMenu: []
            })
            menu.sort((a, b) => {
                return a.position - b.position
            })
            return newState
        case Actions.DELETE_SUB_MENU:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            var menu = app.menu
            var i = menu.findIndex((command) => {
                return command.menuID === action.menuID
            })
            menu.splice(i, 1)
            return newState
        case Actions.SUBSCRIBE_BUTTON:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            var buttons = app.subscribedButtons
            buttons[action.buttonName] = action.isSubscribed
            return newState
        case Actions.ACTIVATE_SUB_MENU:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            app.activeSubMenu = action.menuID
            return newState
        case Actions.DEACTIVATE_SUB_MENU:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            newState[action.appID] = app
            app.activeSubMenu = null
            return newState
        case Actions.PERFORM_INTERACTION:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            app.isPerformingInteraction = true
            app.interactionText = action.text
            app.choices = action.choices
            app.interactionId = action.msgID
            return newState
        case Actions.DEACTIVATE_INTERACTION:
        case Actions.TIMEOUT_PERFORM_INTERACTION:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            app.isPerformingInteraction = false
            app.interactionText = ""
            app.choices = []
            return newState
        case Actions.SET_MEDIA_CLOCK_TIMER:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            if (action.startTime) {
                app.startTime = action.startTime
            }
            if (action.endTime) {
                app.endTime = action.endTime
            }
            if (action.updateMode === "COUNTUP") {
                app.updateTime = new Date().getTime()
            }
            else if (action.updateMode === "PAUSE" && action.startTime) {
                app.pauseTime = new Date().getTime()
                app.updateTime = app.pauseTime
            }
            else if (action.updateMode === "PAUSE") {
                app.pauseTime = new Date().getTime()
            }
            else if (action.updateMode === "RESUME") {
                var now = new Date().getTime()
                app.updateTime = app.updateTime + now - app.pauseTime
            }
            else if (action.updateMode === "CLEAR") {
                app.updateTime = new Date().getTime()
            }
            app.updateMode = action.updateMode
            return newState
        case Actions.UNREGISTER_APPLICATION:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            app.isDisconnected = true
            return newState
        default:
            return state
    }
}

export const hmi = combineReducers({
    appList,
    activeApp,
    ui,
    routing: routerReducer
})
