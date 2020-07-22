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
        triggerShowAppMenu: false,
        activeSubMenu: null,
        menuLayout: "LIST",
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
        countDirection: "COUNTUP",
        updateTime: new Date().getTime(),
        pauseTime: null,
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
        default:
            return state
    }
}

function appList(state = [], action) {
    switch (action.type) {
        case Actions.UPDATE_APP_LIST:
            return action.appList.map((app) => {
                var existingApp = state.find(x => x.appID === app.appID);
                return {
                    ...app,
                    isRegistered: existingApp ? existingApp.isRegistered : false
                };
            });
        case Actions.REGISTER_APPLICATION:
            return state.map((app) => {
                if (app.appID === action.appID) {
                    app.isRegistered = true;
                }
                return app;
            });
        case Actions.UNREGISTER_APPLICATION:
            return state.map((app) => {
                if (app.appID === action.appID) {
                    app.isRegistered = false;
                }
                return app;
            });
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

function systemCapability( state = {}, action) {
    switch(action.type) {
        case Actions.ON_SYSTEM_CAPABILITY_UPDATED:
            var newState = { ...state }
            var type = action.capability.systemCapabilityType
            var capability = {}
            if (type === "NAVIGATION") {
                capability = action.capability.navigationCapability
            } else if (type === "PHONE_CALL") {
                capability = action.capability.phoneCapability
            } else if (type === "VIDEO_STREAMING") {
                capability = action.capability.videoStreamingCapability
            } else if (type === "REMOTE_CONTROL") {
                capability = action.capability.remoteControlCapability
            } else if (type === "APP_SERVICES") {
                capability = action.capability.appServicesCapabilities
            } else if (type === "DISPLAYS"){
                capability = action.capability.displayCapabilities
            }
            newState[type] = capability
            return newState
        default: 
            return state
    }
}

function parseActionBearing(action, bearing) {
    var result = null;
    var simpleBearing = ""
    if (bearing === 0) {
        simpleBearing = "Straight"
    } else if (bearing < 45 && bearing > 0) {
        simpleBearing = "Slight Right"
    } else if (bearing < 180 && bearing > 135) {
        simpleBearing = "Sharp Right"
    } else if (bearing <= 135 && bearing >= 45) {
        simpleBearing = "Right"
    } else if (bearing === 180) {
        simpleBearing = "U-Turn"
    }  else if (bearing <= 359 && bearing > 315) {
        simpleBearing = "Slight Left"
    } else if (bearing < 270 && bearing > 180) {
        simpleBearing = "Sharp Left"
    } else if (bearing <= 315 && bearing >= 225) {
        simpleBearing = "Right"
    }
    
    if (action.length !== 0) {
        action = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()
        result = action
    }
    if (simpleBearing.length !== 0) {
        if (result) {
            result += " " + simpleBearing
        } else {
            result = simpleBearing
        }            
    }

    if (result === "Turn U-Turn") {
        // Exception case for U-turns
        result = "Make U-Turn";
    }

    return result
}

function parseNavDistance (distance) {
    var gt0 = distance > 0;
    var parsedDistance = distance.toFixed(1);
    if (gt0 && parsedDistance === 0) {
        return "<0.1"
    }
    if (parsedDistance > 0 && parsedDistance < 10) {
        return parsedDistance.toString();
    }
    if (parsedDistance > 10) {
        return parsedDistance.toFixed(0).toString();
    }
    return "0"
}

function parseNavData (data) {
    var pData = {            
        location: null,
        actionBearing: null,
        distance: null,
        nextActionBearing: null,
        image: null
    };
    
    if (data.instructions && data.instructions[0]) {
        // Location Details is mandatory
        var instruction = data.instructions[0]

        // Parse first address line
        var locationDetails = instruction.locationDetails;
        var addressLines = locationDetails.addressLines;
        pData.location = addressLines && addressLines[0] ? addressLines[0] : null;

        // Parse Action + Bearing
        var bearing = instruction.bearing ? instruction.bearing : "";
        var action = instruction.action ? instruction.action : ""
        pData.actionBearing = parseActionBearing(action, bearing)

        // Parse Distance
        pData.distance = data.nextInstructionDistance ? parseNavDistance(data.nextInstructionDistance) : null

        // Parse Image
        pData.image = instruction.image ? instruction.image : null

        // Parse Next Action Bearing and Distance
        if (data.instructions[1]) {
            var nextInstruction = data.instructions[1]
            var nextAction = nextInstruction.action ? nextInstruction.action : ""
            var nextBearing = nextInstruction.bearing ? nextInstruction.bearing : ""
            var nextActionBearing = parseActionBearing(nextAction, nextBearing);
            if (nextActionBearing && nextActionBearing.length !== 0) {
                pData.nextActionBearing = "Then " + nextActionBearing
            }            
        } else {
            // No more instructions assume arrived at destination
            pData.nextActionBearing = "Then Arrive At Destination"
        }
    }
    return pData
}

function appServiceData( state = {}, action) {
    switch(action.type) {
        case Actions.ON_APP_SERVICE_DATA:
            var newState = { ...state };
            var data = action.serviceData;
            var type = data.serviceType;
            var serviceID = data.serviceID;
            data = type === "MEDIA" ? data.mediaServiceData : 
                type === "NAVIGATION" ? parseNavData(data.navigationServiceData) : 
                type === "WEATHER" ? data.weatherServiceData : null;

            data.serviceType = type;

            newState[serviceID] = newState[serviceID] ? 
                {...newState[serviceID], ...data} : { ...data };
            return newState;
        default:
            return state
    }
}

function activeApp(state = null, action) {
    switch (action.type) {
        case Actions.ACTIVATE_APP:
            return action.activeApp
        case Actions.DEACTIVATE_APP:
            return action.appID === state ? null : state;
        default:
            return state
    }
}
function pendingAppLaunch(state = null, action) {
    switch (action.type) {
        case Actions.SET_PENDING_APP_LAUNCH:
            return action.appID
        case Actions.CLEAR_PENDING_APP_LAUNCH:
            return null
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
    var newState = { ...state }
    var app = newState[action.appID] ? newState[action.appID] : newAppState();
    newState[action.appID] = app;
    var menu = app.menu;
    var menuItem = null;
    var i = 0;
    switch (action.type) {
        case Actions.SHOW:           
            if (action.showStrings && action.showStrings.length > 0) {
                for (i=0; i < action.showStrings.length; i++) {
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
            app.icon = action.icon
            return newState
        case Actions.ADD_COMMAND:
            var menuParams = action.menuParams
            var cmdID = action.cmdID
            var cmdIcon = action.cmdIcon
            menuItem = {
                cmdID: cmdID,
                parentID: menuParams.parentID,
                position: menuParams.position,
                menuName: menuParams.menuName,
                cmdIcon: cmdIcon
            }
            if (menuParams.parentID) {
                var subMenu = menu.find((command) => {
                    return command.menuID === menuParams.parentID
                });
                (menuParams.position || menuParams.position === 0) ? 
                    subMenu.subMenu.splice(menuParams.position, 0, menuItem) : 
                    subMenu.subMenu.push(menuItem);
            } else {
                (menuParams.position || menuParams.position === 0) ? 
                    menu.splice(menuParams.position, 0, menuItem) : 
                    menu.push(menuItem);
            }
            return newState
        case Actions.DELETE_COMMAND:
            menu = deleteCommand(menu, action.cmdID)
            return newState
        case Actions.ADD_SUB_MENU:
            var position = action.menuParams.position
            menuItem = {
                menuID: action.menuID,
                parentID: action.menuParams.parentID,
                position: action.menuParams.position,
                menuName: action.menuParams.menuName,
                cmdIcon: action.subMenuIcon,
                subMenu: [],
                menuLayout: action.menuLayout ? action.menuLayout : app.menuLayout
            };
            (position || position === 0) ? 
                menu.splice(position, 0, menuItem) : 
                menu.push(menuItem);
            return newState
        case Actions.DELETE_SUB_MENU:
            i = menu.findIndex((command) => {
                return command.menuID === action.menuID
            })
            menu.splice(i, 1)
            return newState
        case Actions.SHOW_APP_MENU:
            app.triggerShowAppMenu = true
            // If action has menuID, activate submenu otherwise deactivate sub menu
            app.activeSubMenu = (action.menuID) ? action.menuID : null;
            return newState
        case Actions.SUBSCRIBE_BUTTON:
            var buttons = app.subscribedButtons
            buttons[action.buttonName] = action.isSubscribed
            return newState
        case Actions.ACTIVATE_SUB_MENU:
            app.activeSubMenu = action.menuID
            return newState
        case Actions.DEACTIVATE_SUB_MENU:
            app.activeSubMenu = null
            return newState
        case Actions.PERFORM_INTERACTION:
            app.isPerformingInteraction = true
            app.interactionText = action.text
            app.choices = action.choices
            app.interactionId = action.msgID
            app.interactionCancelId = action.cancelID
            return newState
        case Actions.DEACTIVATE_INTERACTION:
        case Actions.TIMEOUT_PERFORM_INTERACTION:
            app.isPerformingInteraction = false
            app.interactionText = ""
            app.choices = []
            return newState
        case Actions.SET_MEDIA_CLOCK_TIMER:
            if (action.startTime) {
                app.startTime = action.startTime
            }
            if (action.endTime) {
                app.endTime = action.endTime
            }

            if (action.updateMode === "COUNTUP") {
                if (action.updateMode !== app.countDirection) {
                    app.endTime = action.endTime ? action.endTime : null
                }
                app.countDirection = action.updateMode
                app.updateTime = new Date().getTime()
            }
            else if (action.updateMode === "COUNTDOWN") {
                if (action.updateMode !== app.countDirection) {
                    app.endTime = action.endTime ? action.endTime : null
                }
                app.countDirection = action.updateMode
                app.updateTime = new Date().getTime()
            }
            else if (action.updateMode === "PAUSE" && action.startTime) {
                app.pauseTime = new Date().getTime()
                app.updateTime = app.pauseTime
            }
            else if (action.updateMode === "PAUSE" && !app.pauseTime) {
                app.pauseTime = new Date().getTime()
            }
            else if (action.updateMode === "RESUME" && app.pauseTime) {
                var now = new Date().getTime()
                app.updateTime = app.updateTime + now - app.pauseTime
            }
            else if (action.updateMode === "CLEAR") {
                app.updateTime = new Date().getTime()
                app.startTime = null
                app.endTime = null
            }
            app.updateMode = action.updateMode
            if(action.audioStreamingIndicator) {
                app.audioStreamingIndicator = action.audioStreamingIndicator
            }
            if (action.updateMode !== "PAUSE") {
                app.pauseTime = null
            }
            return newState
        case Actions.SET_TEMPLATE_CONFIGURATION:
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
                case "WEB_VIEW":
                    app.displayLayout = "webview"
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
            app.displayLayout = action.displayLayout;
            return newState
        case Actions.UNREGISTER_APPLICATION:
            if (newState[action.appID]) {
                delete newState[action.appID]
            }
            return newState
        case Actions.ALERT:
            app.alert.showAlert = true
            app.alert.alertStrings = action.alertStrings
            app.alert.duration = action.duration
            app.alert.softButtons = action.softButtons
            app.alert.alertType = action.alertType
            app.alert.showProgressIndicator = action.showProgressIndicator
            app.alert.msgID = action.msgID
            app.alert.icon = action.icon
            app.alert.cancelID = action.cancelID
            return newState
        case Actions.CLOSE_ALERT:
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
            if (action.dayColorScheme) {
                app.dayColorScheme = action.dayColorScheme
            }

            if (action.nightColorScheme) {
                app.nightColorScheme = action.nightColorScheme
            }
            return newState   
        case Actions.SET_APP_IS_CONNECTED:
            app.isDisconnected = false
            return newState
        case Actions.ON_PUT_FILE:
            return newState
        case Actions.RESET_SHOW_APP_MENU:
            app.triggerShowAppMenu = false     
            return newState
        case Actions.SET_GLOBAL_PROPERTIES:
            if (action.menuLayout && action.menuLayout.length) {
                app.menuLayout = action.menuLayout
            }
            return newState
        default:
            return state
    }
}

function system(state = {}, action) {
    var newState = { ...state }
    switch(action.type) {
        case Actions.POLICY_UPDATE:            
            newState.policyFile = action.file
            newState.policyRetry = action.retry
            newState.policyTimeout = action.timeout
            return newState
        case Actions.SET_URLS:
            newState.urls = action.urls
            return newState
        case Actions.SET_PTU_WITH_MODEM:
            newState.ptuWithModemEnabled = action.enabled
            return newState
        default:
            return state

    }
}

function appStore(state = {
    isConnected: false,
    showWebView: false,
    availableApps: [],
    installedApps: [],
    appsPendingSetAppProperties: []
}, action) {
    var newState = { ...state };
    switch (action.type) {
        case Actions.UPDATE_APPSTORE_CONNECTION_STATUS:
            newState.isConnected = action.isConnected
            return newState;
        case Actions.UPDATE_AVAILABLE_APPSTORE_APPS:
            newState.availableApps = action.availableApps;
            newState.installedApps = state.installedApps.map((app) => {
                var appDirEntry = action.availableApps.find(x => x.policyAppID === app.policyAppID);
                return appDirEntry ? Object.assign(appDirEntry, app) : app;
            });
            return newState;
        case Actions.UPDATE_INSTALLED_APPSTORE_APPS:
            let existingApp = newState.installedApps.find(app => app.policyAppID === action.installedApp.policyAppID)

            if (!existingApp) {
                let appDirEntry = newState.availableApps.find(x => x.policyAppID === action.installedApp.policyAppID);
                newState.installedApps.push(
                    appDirEntry ? Object.assign(appDirEntry, action.installedApp) : action.installedApp
                );
                return newState;
            }
            existingApp = Object.assign(existingApp, action.installedApp);
            return newState;
        case Actions.ADD_APP_PENDING_SET_APP_PROPERTIES:
            newState.appsPendingSetAppProperties.push({ app: action.app, enable: action.enable});
            return newState;
        case Actions.APPSTORE_APP_INSTALLED:
            var pendingAppInstall = newState.appsPendingSetAppProperties.shift()['app'];
            if (!action.success) { return newState; }
            var newInstalled = [ pendingAppInstall ].concat(newState.installedApps);
            newState.installedApps = newInstalled;
            var appStoreAppInstalled = newState.availableApps.find(app => app.policyAppID === pendingAppInstall.policyAppID);
            if (appStoreAppInstalled) { appStoreAppInstalled.pendingInstall = false; }
            return newState;
        case Actions.APPSTORE_APP_UNINSTALLED:
            let pendingAppUninstall = newState.appsPendingSetAppProperties.shift()['app'];
            if (!action.success) { return newState; }
            newState.installedApps = state.installedApps.filter(app => app.policyAppID !== pendingAppUninstall.policyAppID);
            return newState;
        case Actions.WEBENGINE_APP_LAUNCH:
            var launchedApp = newState.installedApps.find(x => x.policyAppID === action.policyAppID);
            launchedApp.runningAppId = action.appID;
            return newState;
        case Actions.UNREGISTER_APPLICATION:
            var unregisteredApp = newState.installedApps.find(x => x.runningAppId === action.appID);
            if (unregisteredApp) { unregisteredApp.runningAppId = 0; }
            return newState;
        case Actions.APPSTORE_BEGIN_INSTALL:
            let appStoreAppToInstall = newState.availableApps.find(app => app.policyAppID === action.policyAppID);
            if (appStoreAppToInstall) { appStoreAppToInstall.pendingInstall = true; }
            return newState;
        case Actions.SHOW_WEB_VIEW:
            newState.showWebView = true;
            return newState;
        case Actions.HIDE_WEB_VIEW:
            newState.showWebView = false;
            return newState;
        default:
            return state;
    }
}

export const hmi = combineReducers({
    theme,
    appList,
    appServiceData,
    activeApp,
    pendingAppLaunch,
    ui,
    system,
    systemCapability,
    appStore
})
