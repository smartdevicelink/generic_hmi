import { combineReducers } from 'redux';
import { Actions } from './actions';
import './polyfill_find'


function newAppState () {
    return {
        showStrings: {},
        graphic: null,
        secondaryGraphic: null,
        softButtons: [],
        icon: null,
        menu: [],
        activeSubMenu: null,
        subscribedButtons: {},
        isPerformingInteraction: false,
        interactionText: "",
        choices: [],
        startTime: null,
        endTime: {
            hours: 0,
            minutes: 0,
            seconds: 0
        },
        updateMode: "CLEAR",
        updateTime: new Date().getTime(),
        pauseTime: new Date().getTime(),
        isDisconnected: false,
        displayLayout:  null,
        alert: {
            showAlert: false,
            alertStrings: [],
            duration: null,
            softButtons: [],
            alertType: null,
            showProgressIndicator: null,
            msgID: null
        },
        dayColorScheme: null,
        nightColorScheme: null
    }
}

function theme(state = true, action) {
    switch (action.type) {
        case Actions.SET_THEME:
            return action.theme
            break
        default:
            return state
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
        case Actions.DEACTIVATE_APP:
            return null;
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
                for (var i=0; i < action.showStrings.length; i++) {
                    var fieldName = action.showStrings[i].fieldName
                    var fieldText = action.showStrings[i].fieldText
                    app.showStrings[fieldName] = fieldText
                }
            }
            if (action.graphic) {
                app.graphic = action.graphic
            }
            if (action.secondaryGraphic) {
                app.secondaryGraphic = action.secondaryGraphic
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
            var menuItem = {
                cmdID: cmdID,
                parentID: menuParams.parentID,
                position: menuParams.position,
                menuName: menuParams.menuName,
                cmdIcon: cmdIcon
            }
            if (menuParams.parentID) {
                var subMenu = menu.find((command) => {
                    return command.menuID === menuParams.parentID
                })
                // Push item to front of list if position is 0
                (menuParams.position === 0) ? 
                    subMenu.subMenu.unshift(menuItem) : 
                    subMenu.subMenu.push(menuItem);

                subMenu.subMenu.sort((a, b) => {
                    return a.position - b.position
                })
            } else {
                // Push item to front of list if position is 0
                (menuParams.position === 0) ? 
                    menu.unshift(menuItem) : 
                    menu.push(menuItem);

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
                cmdIcon: action.subMenuIcon,
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
            if(action.audioStreamingIndicator) {
                app.audioStreamingIndicator = action.audioStreamingIndicator
            }
            return newState
        case Actions.SET_DISPLAY_LAYOUT:
            var newState = {...state}
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            switch(action.displayLayout) {
                case "DEFAULT":
                    app.displayLayout = "media"
                    break
                case "MEDIA":
                    app.displayLayout = "media"
                    break
                case "NON-MEDIA":
                    app.displayLayout = "nonmedia"
                    break
                case "LARGE_GRAPHIC_ONLY":
                    app.displayLayout = "large-graphic-only"
                    break
                case "LARGE_GRAPHIC_WITH_SOFTBUTTONS":
                    app.displayLayout = "large-graphic-with-softbuttons"
                    break
                case "GRAPHIC_WITH_TEXTBUTTONS":
                    app.displayLayout = "graphic-with-text-buttons"
                    break                    
                case "TEXTBUTTONS_WITH_GRAPHIC":
                    app.displayLayout = "text-buttons-with-graphic"
                    break
                case "TEXTBUTTONS_ONLY":
                    app.displayLayout = "text-buttons-only"
                    break
                case "TILES_ONLY":
                    app.displayLayout = "tiles-only"
                    break
                case "TEXT_WITH_GRAPHIC":
                    app.displayLayout = "text-with-graphic"
                    break
                case "GRAPHIC_WITH_TEXT":
                    app.displayLayout = "graphic-with-text"
                    break
                case "DOUBLE_GRAPHIC_WITH_SOFTBUTTONS":
                    app.displayLayout = "double-graphic-with-softbuttons"
                    break
                default: 
                    break
            }
            if (action.dayColorScheme) {
                app.dayColorScheme = action.dayColorScheme
            }

            if (action.nightColorScheme) {
                app.nightColorScheme = action.nightColorScheme
            }            
            return newState
        case Actions.REGISTER_APPLICATION:
            var newState = { ...state }         
            if (!newState[action.appID]) {
              newState[action.appID] = newAppState()
            }
            var app = newState[action.appID]
            if (app.displayLayout == null) {
              app.displayLayout = action.isMediaApplication ? "media" : "nonmedia"
            }
            return newState
        case Actions.UNREGISTER_APPLICATION:
            var newState = { ...state }
            if (newState[action.appID]) {
                delete newState[action.appID]
            }
            return newState
        case Actions.ALERT:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            app.alert.showAlert = true
            app.alert.alertStrings = action.alertStrings
            app.alert.duration = action.duration
            app.alert.softButtons = action.softButtons
            app.alert.alertType = action.alertType
            app.alert.showProgressIndicator = action.showProgressIndicator
            app.alert.msgID = action.msgID
            return newState
        case Actions.CLOSE_ALERT:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            app.alert =  {
                showAlert: false,
                alertStrings: [],
                duration: null,
                softButtons: [],
                alertType: null,
                showProgressIndicator: null,
                msgID: null
            }
            return newState
        case Actions.UPDATE_COLOR_SCHEME:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            if (action.dayColorScheme) {
                app.dayColorScheme = action.dayColorScheme
            }

            if (action.nightColorScheme) {
                app.nightColorScheme = action.nightColorScheme
            }
            return newState   
        case Actions.SET_APP_IS_CONNECTED:
            var newState = { ...state }
            var app = newState[action.appID] ? newState[action.appID] : newAppState()
            app.isDisconnected = false
            return newState
        default:
            return state
    }
}

function system(state = {}, action) {
    switch(action.type) {
        case Actions.POLICY_UPDATE:
            var newState = { ...state }
            newState.policyFile = action.file
            newState.policyRetry = action.retry
            newState.policyTimeout = action.timeout
            return newState
        case Actions.GET_URLS:
            var newState = { ...state }
            newState.urls = action.urls
            return newState
        default:
            return state

    }
}

export const hmi = combineReducers({
    theme,
    appList,
    activeApp,
    ui,
    system
})