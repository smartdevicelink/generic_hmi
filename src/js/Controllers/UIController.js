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
    activateApp,
    showAppMenu
} from '../actions'
import store from '../store'
import sdlController from './SDLController'

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
    }
    addListener(listener) {
        this.listener = listener
    }

    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, true)}
            case "GetCapabilities":
                if (rpc.method.split(".")[0] === "UI") {
                    return {"rpc": RpcFactory.UIGetCapabilitiesResponse(rpc)}
                } else if (rpc.method.split(".")[0] === "Buttons") {
                    return {"rpc": RpcFactory.ButtonsGetCapabilitiesResponse(rpc)}
                } else {
                    return false;
                }                
            case "Show":
                if (rpc.params.windowID && rpc.params.windowID != 0) {
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
                    var appUIState = store.getState()['ui'][rpc.params.appID];
                    const prevDisplayLayout = appUIState ? appUIState.displayLayout : "";
                    const templateConfiguration = rpc.params.templateConfiguration;
                    store.dispatch(setTemplateConfiguration(
                        templateConfiguration.template, 
                        rpc.params.appID, 
                        templateConfiguration.dayColorScheme, 
                        templateConfiguration.nightColorScheme
                    ));
                    
                    if (prevDisplayLayout != templateConfiguration.template) {
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

                var appUIState = store.getState()['ui'][rpc.params.appID];
                const prevDisplayLayout = appUIState ? appUIState.displayLayout : "";

                store.dispatch(setTemplateConfiguration(rpc.params.displayLayout, rpc.params.appID, rpc.params.dayColorScheme, rpc.params.nightColorScheme));
                
                if (prevDisplayLayout != rpc.params.displayLayout) {
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
                    rpc.params.cancelID
                ))
                var timeout = rpc.params.duration ? rpc.params.duration : 10000
                const state = store.getState()
                const context = state.activeApp

                this.timers[rpc.id] = setTimeout(this.onAlertTimeout, timeout, rpc.id, rpc.params.appID, context ? context : rpc.params.appID)
                this.appsWithTimers[rpc.id] = rpc.params.appID

                this.onSystemContext("ALERT", rpc.params.appID)

                if ((context != rpc.params.appID) && context) {
                    this.onSystemContext("HMI_OBSCURED", context)
                }

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
                    return true
                } else if (rpc.params.functionID === 12 && app.alert.showAlert
                     && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.alert.cancelID)) {
                    clearTimeout(this.timers[app.alert.msgID])
                    delete this.timers[app.alert.msgID]
                    this.listener.send(RpcFactory.AlertAbortedResponse(app.alert.msgID))
                    store.dispatch(closeAlert(app.alert.msgID, rpc.params.appID))
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
    onAlertTimeout(msgID, appID, context) {
        delete this.timers[msgID]
        store.dispatch(closeAlert(
            msgID,
            appID
        ))
        this.listener.send(RpcFactory.AlertResponse(msgID, appID))

        if (appID != context) {
            this.onSystemContext("MAIN", appID)
        }
        this.onSystemContext("MAIN", context)
    }
    onStealFocus(alert, context) {        
        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        store.dispatch(closeAlert(
            alert.msgID,
            alert.appID
        ))        
        this.listener.send(RpcFactory.AlertResponse(alert.msgID, alert.appID))
        if(context){
            this.onSystemContext("MAIN", context)
        } else {
            this.onSystemContext("MENU")//Viewing App List
        }
        this.onSystemContext("MAIN", alert.appID)
        sdlController.onAppActivated(alert.appID)
        
    }
    onKeepContext(alert) {
        clearTimeout(this.timers[alert.msgID])
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        var timeout = alert.duration ? alert.duration : 10000
        const state = store.getState()
        const context = state.activeApp
        
        this.timers[alert.msgID] = setTimeout(this.onAlertTimeout, timeout, alert.msgID, alert.appID, context ? context : alert.appID)
        this.onResetTimeout(alert.appID, "UI.Alert")
    }
    onDefaultAction(alert, context) {
        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        store.dispatch(closeAlert(
            alert.msgID,
            alert.appID
        ))
        this.listener.send(RpcFactory.AlertResponse(alert.msgID, alert.appID))
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
}

let controller = new UIController ()
export default controller