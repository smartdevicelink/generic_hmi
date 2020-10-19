import RpcFactory from './RpcFactory'
import {
    show,
    setAppIcon, 
    addCommand, 
    addSubMenu, 
    deleteCommand, 
    deleteSubMenu, 
    subscribeButton, 
    performInteraction,
    timeoutPerformInteraction,
    setMediaClockTimer,
    setTemplateConfiguration,
    alert,
    closeAlert,
    setGlobalProperties,
    deactivateInteraction,
    showAppMenu
} from '../actions'
import store from '../store'
import sdlController from './SDLController'
import SubmenuDeepFind from '../Utils/SubMenuDeepFind'

const getNextSystemContext = () => {
    const state = store.getState();
    const activeApp = state.activeApp;
    const pathName = window.location.pathname;
    const inMenuContext = (pathName.includes("/inappmenu") 
        || pathName.includes("/inapplist")) 
        && activeApp && state.ui[activeApp] 
        && !state.ui[activeApp].isPerformingInteraction;
    if (inMenuContext) {
        return "MENU"
    }
    return "MAIN"
}

class UIController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.failInteractions = this.failInteractions.bind(this)
        this.onPerformInteractionTimeout = this.onPerformInteractionTimeout.bind(this)
        this.onAlertTimeout = this.onAlertTimeout.bind(this)
        this.onDefaultAction = this.onDefaultAction.bind(this)
        this.onKeepContext = this.onKeepContext.bind(this)
        this.onStealFocus = this.onStealFocus.bind(this)
        this.timers = {}
        this.appsWithTimers = {}
        this.endTimes = {}
    }
    addListener(listener) {
        this.listener = listener
    }

    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        var appUIState = rpc.params && rpc.params.appID ? store.getState()['ui'][rpc.params.appID] : null;
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, true)}
            case "GetSupportedLanguages":
                return { rpc: RpcFactory.GetSupportedLanguagesResponse(rpc) }
            case "GetLanguage":
                return { rpc: RpcFactory.GetLanguageResponse(rpc) }
            case "GetCapabilities":
                if (rpc.method.split(".")[0] === "UI") {
                    return {"rpc": RpcFactory.UIGetCapabilitiesResponse(rpc)}
                } else if (rpc.method.split(".")[0] === "Buttons") {
                    return {"rpc": RpcFactory.ButtonsGetCapabilitiesResponse(rpc)}
                } else {
                    return false;
                }                
            case "Show":
                if (rpc.params.windowID && rpc.params.windowID !== 0) {
                    // Generic HMI only supports main window for now.
                    return false;
                }
                store.dispatch(show(
                    rpc.params.appID,
                    rpc.params.showStrings,
                    rpc.params.graphic,
                    rpc.params.softButtons,
                    rpc.params.secondaryGraphic
                ));
                if (rpc.params.templateConfiguration) {
                    const prevDisplayLayout = appUIState ? appUIState.displayLayout : "";
                    const templateConfiguration = rpc.params.templateConfiguration;
                    store.dispatch(setTemplateConfiguration(
                        templateConfiguration.template, 
                        rpc.params.appID, 
                        templateConfiguration.dayColorScheme, 
                        templateConfiguration.nightColorScheme
                    ));
                    
                    if (prevDisplayLayout !== templateConfiguration.template) {
                        this.listener.send(RpcFactory.OnSystemCapabilityDisplay(templateConfiguration.template, rpc.params.appID));
                    }                    
                }
                return true
            case "SetAppIcon":
                store.dispatch(setAppIcon(rpc.params.appID, rpc.params.syncFileName))
                return true
            case "ChangeRegistration":
                return true
            case "AddCommand":
                store.dispatch(addCommand(
                    rpc.params.appID,
                    rpc.params.cmdID,
                    rpc.params.menuParams,
                    rpc.params.cmdIcon
                ))
                return true
            case "AddSubMenu":
                if (appUIState) {
                    var menu = appUIState.menu;
                    var result = SubmenuDeepFind(menu, rpc.params.menuID, 0)
                    if (result) {
                        // Duplicate menuID, reject
                        return {
                            rpc: RpcFactory.InvalidIDResponse(rpc, "Sub menu ID already exists")
                        }
                    }
                }
                store.dispatch(addSubMenu(
                    rpc.params.appID,
                    rpc.params.menuID,
                    rpc.params.menuParams,
                    rpc.params.menuIcon,
                    rpc.params.menuLayout
                ))
                return true
            case "DeleteCommand":
                store.dispatch(deleteCommand(
                    rpc.params.appID,
                    rpc.params.cmdID
                ))
                return true
            case "DeleteSubMenu":
                store.dispatch(deleteSubMenu(
                    rpc.params.appID,
                    rpc.params.menuID
                ))
                return true
            case "ShowAppMenu":
                store.dispatch(showAppMenu(
                    rpc.params.appID,
                    rpc.params.menuID
                ))
                this.onSystemContext("MENU", rpc.params.appID)
                return true
            case "OnButtonSubscription":
                store.dispatch(subscribeButton(
                    rpc.params.appID,
                    rpc.params.name,
                    rpc.params.isSubscribed
                ))
                return null
            case "PerformInteraction":
                store.dispatch(performInteraction(
                    rpc.params.appID,
                    rpc.params.initialText,
                    rpc.params.choiceSet,
                    rpc.params.interactionLayout,
                    rpc.id,
                    rpc.params.cancelID
                ))
                var timeout = rpc.params.timeout === 0 ? 15000 : rpc.params.timeout
                this.endTimes[rpc.id] = Date.now() + timeout;
                this.timers[rpc.id] = setTimeout(this.onPerformInteractionTimeout, timeout, rpc.id, rpc.params.appID)
                this.appsWithTimers[rpc.id] = rpc.params.appID
                this.onSystemContext("HMI_OBSCURED", rpc.params.appID)
                break
            case "SetMediaClockTimer":
                store.dispatch(setMediaClockTimer(
                    rpc.params.appID,
                    rpc.params.startTime,
                    rpc.params.endTime,
                    rpc.params.updateMode,
                    rpc.params.audioStreamingIndicator
                ))
                return true
            case "SetDisplayLayout":
                console.log("Warning: RPC SetDisplayLayout is deprecated");
                const prevDisplayLayout = appUIState ? appUIState.displayLayout : "";

                store.dispatch(setTemplateConfiguration(rpc.params.displayLayout, rpc.params.appID, rpc.params.dayColorScheme, rpc.params.nightColorScheme));
                
                if (prevDisplayLayout !== rpc.params.displayLayout) {
                    this.listener.send(RpcFactory.OnSystemCapabilityDisplay(rpc.params.displayLayout, rpc.params.appID));
                }
                return {"rpc": RpcFactory.SetDisplayLayoutResponse(rpc)};
            case "SetGlobalProperties":
                store.dispatch(setGlobalProperties(
                    rpc.params.appID,
                    rpc.params.menuLayout
                ))
                return true
            case "Alert":
                store.dispatch(alert(
                    rpc.params.appID,
                    rpc.params.alertStrings,
                    rpc.params.duration,
                    rpc.params.softButtons,
                    rpc.params.alertType,
                    rpc.params.progressIndicator,
                    rpc.id,
                    rpc.params.alertIcon,
                    rpc.params.cancelID,
                    false
                ))
                var alertTimeout = rpc.params.duration ? rpc.params.duration : 10000
                const state = store.getState()
                const context = state.activeApp

                this.endTimes[rpc.id] = Date.now() + alertTimeout;
                this.timers[rpc.id] = setTimeout(this.onAlertTimeout, alertTimeout, rpc.id, rpc.params.appID, context ? context : rpc.params.appID, false)
                this.appsWithTimers[rpc.id] = rpc.params.appID

                this.onSystemContext("ALERT", rpc.params.appID)

                if ((context !== rpc.params.appID) && context) {
                    this.onSystemContext("HMI_OBSCURED", context)
                }

                return null
            case "SubtleAlert":

                var tryAgainInfo = undefined;
                var activeInteractionId = undefined;
                const state3 = store.getState();
                for (var appId in state3.ui) {
                    var app2 = state3.ui[appId];
                    if (app2.isPerformingInteraction) {
                        tryAgainInfo = 'A PerformInteraction is active';
                        activeInteractionId = app2.interactionId;
                    } else if (app2.alert.showAlert) {
                        tryAgainInfo = (app2.alert.isSubtle ? 'Another SubtleAlert' : 'An Alert') + ' is active';
                        activeInteractionId = app2.alert.msgID;
                    }
                }

                if (activeInteractionId) {
                    var tryAgainTime = this.endTimes[activeInteractionId] - Date.now();
                    var rpc2 = RpcFactory.SubtleAlertErrorResponse(rpc.id, 4, tryAgainInfo);
                    rpc2.error.data.tryAgainTime = tryAgainTime;
                    return { rpc: rpc2 };
                }

                store.dispatch(alert(
                    rpc.params.appID,
                    rpc.params.alertStrings,
                    rpc.params.duration,
                    rpc.params.softButtons,
                    rpc.params.alertType,
                    rpc.params.progressIndicator,
                    rpc.id,
                    rpc.params.alertIcon,
                    rpc.params.cancelID,
                    true
                ));

                const context2 = state3.activeApp;
                this.onSystemContext("ALERT", rpc.params.appID);
                if (context2 && (context2 !== rpc.params.appID)) {
                    this.onSystemContext("HMI_OBSCURED", context2)
                }

                var subtleAlertTimeout = rpc.params.duration ? rpc.params.duration : 10000;
                this.endTimes[rpc.id] = Date.now() + subtleAlertTimeout;
                this.timers[rpc.id] = setTimeout(this.onAlertTimeout, subtleAlertTimeout, rpc.id, rpc.params.appID, context2 ? context2 : rpc.params.appID, true);
                this.appsWithTimers[rpc.id] = rpc.params.appID;

                return null
            case "CancelInteraction":

                const state2 = store.getState()
                var app = state2.ui[state2.activeApp]
                
                if (rpc.params.functionID === 10 && app.isPerformingInteraction
                     && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.interactionCancelId)) {
                    clearTimeout(this.timers[app.interactionId])
                    delete this.timers[app.interactionId]
                    this.listener.send(RpcFactory.UIPerformInteractionAbortedResponse(app.interactionId))
                    store.dispatch(deactivateInteraction(rpc.params.appID))
                    this.onSystemContext("MAIN", rpc.params.appID)
                    return true
                } else if (rpc.params.functionID === 12 && app.alert.showAlert && !app.alert.isSubtle
                     && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.alert.cancelID)) {
                    clearTimeout(this.timers[app.alert.msgID])
                    delete this.timers[app.alert.msgID]
                    this.listener.send(RpcFactory.AlertAbortedResponse(app.alert.msgID))
                    store.dispatch(closeAlert(app.alert.msgID, rpc.params.appID))
                    const context = getNextSystemContext();
                    this.onSystemContext(context, rpc.params.appID)
                    return true
                } else if (rpc.params.functionID === 64 && app.alert.showAlert && app.alert.isSubtle
                    && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.alert.cancelID)) {
                   clearTimeout(this.timers[app.alert.msgID])
                   delete this.timers[app.alert.msgID]
                   this.listener.send(RpcFactory.SubtleAlertErrorResponse(app.alert.msgID, 5, 'subtle alert was cancelled'))
                   store.dispatch(closeAlert(app.alert.msgID, rpc.params.appID))
                   const context = getNextSystemContext();
                   this.onSystemContext(context, rpc.params.appID)
                   return true
                }
                
                return { rpc: RpcFactory.UICancelInteractionIgnoredResponse(rpc) }
            default:
                return false;
        }
    }
    onPerformInteractionTimeout(msgID, appID) {
        delete this.timers[msgID]
        this.listener.send(RpcFactory.UIPerformInteractionTimeout(msgID))
        store.dispatch(timeoutPerformInteraction(
            msgID,
            appID
        ))
        this.onSystemContext("MAIN", appID)
    }
    onAlertTimeout(msgID, appID, context, isSubtle) {
        delete this.timers[msgID]
        store.dispatch(closeAlert(
            msgID,
            appID
        ))
        const rpc = isSubtle
            ? RpcFactory.SubtleAlertErrorResponse(msgID, 10, 'subtle alert timed out')
            : RpcFactory.AlertResponse(msgID, appID);
        this.listener.send(rpc)

        if (appID !== context) {
            this.onSystemContext("MAIN", appID)
        }
        this.onSystemContext("MAIN", context)
    }
    onStealFocus(alert, context, isSubtle) {        
        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]

        if (alert.buttonID) {
            this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName);
        } else { // can be invoked by clicking subtle alert modal
            this.listener.send(RpcFactory.OnSubtleAlertPressed(alert.appID));
        }

        store.dispatch(closeAlert(alert.msgID, alert.appID))

        const rpc = isSubtle
            ? RpcFactory.SubtleAlertResponse(alert.msgID)
            : RpcFactory.AlertResponse(alert.msgID, alert.appID);
        this.listener.send(rpc);

        if(context){
            this.onSystemContext("MAIN", context)
        } else {
            this.onSystemContext("MENU")//Viewing App List
        }

        this.onSystemContext("MAIN", alert.appID)
        sdlController.onAppActivated(alert.appID)
    }
    onKeepContext(alert, isSubtle) {
        clearTimeout(this.timers[alert.msgID])
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        var timeout = alert.duration ? alert.duration : 10000
        const state = store.getState()
        const context = state.activeApp
        
        this.timers[alert.msgID] = setTimeout(this.onAlertTimeout, timeout, alert.msgID, alert.appID, context ? context : alert.appID, isSubtle);
        this.onResetTimeout(alert.appID, isSubtle ? "UI.SubtleAlert" : "UI.Alert");
    }
    onDefaultAction(alert, context, isSubtle) {
        if (!alert.msgID) {
            // This was a system alert, do not send a response to Core
            return
        }

        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]

        if (alert.buttonID) { // can be invoked by clicking outside of subtle alert
            this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName);
        }

        store.dispatch(closeAlert(alert.msgID, alert.appID));

        const rpc = isSubtle
            ? RpcFactory.SubtleAlertResponse(alert.msgID)
            : RpcFactory.AlertResponse(alert.msgID, alert.appID);
        this.listener.send(rpc);

        if(context){
            this.onSystemContext("MAIN", context)
        } else {
            this.onSystemContext("MENU")//Viewing App List
        }
    }
    onChoiceSelection(choiceID, appID, msgID) {
        clearTimeout(this.timers[msgID])
        delete this.timers[msgID]
        this.listener.send(RpcFactory.UIPerformInteractionResponse(choiceID, appID, msgID))
    }
    onSystemContext(context, appID) {
        this.listener.send(RpcFactory.OnSystemContextNotification(context, appID))
    }
    onCommand(cmdID, appID) {
        this.listener.send(RpcFactory.OnCommandNotification(cmdID, appID))
    }
    onButtonPress(appID, buttonID, buttonName) {
        var button = {
            name: buttonName,
            mode: "BUTTONDOWN",
            customButtonID: buttonID
        }
        this.listener.send(RpcFactory.OnButtonEventNotification(appID, button))
        button.mode = "BUTTONUP"
        this.listener.send(RpcFactory.OnButtonEventNotification(appID, button))
        button.mode = "SHORT"
        this.listener.send(RpcFactory.OnButtonPressNotification(appID, button))
    }
    onButtonEventDown(appID, buttonID, buttonName) {
        var button = {
            name: buttonName,
            mode: "BUTTONDOWN",
            customButtonID: buttonID
        }
        this.listener.send(RpcFactory.OnButtonEventNotification(appID, button))
    }
    onButtonEventUp(appID, buttonID, buttonName) {
        var button = {
            name: buttonName,
            mode: "BUTTONUP",
            customButtonID: buttonID
        }
        this.listener.send(RpcFactory.OnButtonEventNotification(appID, button))
    }
    onShortButtonPress(appID, buttonID, buttonName) {
        var button = {
            name: buttonName,
            mode: "SHORT",
            customButtonID: buttonID
        }
        this.listener.send(RpcFactory.OnButtonPressNotification(appID, button))
    }
    onLongButtonPress(appID, buttonID, buttonName) {
        var button = {
            name: buttonName,
            mode: "LONG",
            customButtonID: buttonID
        }
        this.listener.send(RpcFactory.OnButtonPressNotification(appID, button))
    }
    failInteractions() {
        for (var msgID in this.timers) {
            clearTimeout(this.timers[msgID])
            delete this.timers[msgID]
            this.listener.send(RpcFactory.UIPerformInteractionFailure(parseInt(msgID)))
            store.dispatch(timeoutPerformInteraction(
                parseInt(msgID),
                this.appsWithTimers[msgID]
            ))
        }
    }
    onResetTimeout(appID, methodName) {
        this.listener.send(RpcFactory.OnResetTimeout(appID, methodName))
    }

    onUpdateFile(appID, fileName) {
        this.listener.send(RpcFactory.OnUpdateFile(appID, fileName));
    }

    onUpdateSubMenu(appID, menuID) {
        this.listener.send(RpcFactory.OnUpdateSubMenu(appID, menuID))
    }
}

let controller = new UIController ()
export default controller