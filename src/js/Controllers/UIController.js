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
    alertTimeoutReseted,
    closeAlert,
    setGlobalProperties,
    deactivateInteraction,
    showAppMenu,
    setHapticData
} from '../actions'
import store from '../store'
import sdlController from './SDLController'
import SubmenuDeepFind from '../Utils/SubMenuDeepFind'
import { ValidateImages, AddImageValidationRequest, RemoveImageValidationResult } from '../Utils/ValidateImages'

const getNextSystemContext = () => {
    const state = store.getState();
    const activeApp = state.activeApp;
    const pathName = window.location.hash;
    const inMenuContext = (pathName.includes("/inappmenu") 
        || pathName.includes("/inapplist")) 
        && activeApp && state.ui[activeApp] 
        && !state.ui[activeApp].isPerformingInteraction;
    if (inMenuContext) {
        return "MENU"
    }
    return "MAIN"
}

const RESPONSE_CORRELATION_MS = 1000;
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

                let showImages = [rpc.params.graphic, rpc.params.secondaryGraphic];
                if (rpc.params.softButtons) {
                    rpc.params.softButtons.forEach (softBtn => {
                        if (softBtn.image) { showImages.push(softBtn.image); }
                    });
                }

                const showResponse = RpcFactory.UIShowResponse(rpc)
                ValidateImages(showImages).then(
                    () => {this.listener.send(showResponse)},
                    () => {
                        const invalidImgResponse = RpcFactory.InvalidImageResponse(rpc)
                        this.listener.send(RpcFactory.CombineWithWarningsResponse(showResponse, invalidImgResponse))
                    }
                );
                break;
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
                    rpc.params.cmdIcon,
                    rpc.params.secondaryImage
                ))
                
                ValidateImages([rpc.params.cmdIcon]).then(
                    () => {this.listener.respondSuccess(rpc.method, rpc.id)},
                    () => {this.listener.send(RpcFactory.InvalidImageResponse(rpc))}
                );
                break;
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
                    rpc.params.menuLayout,
                    rpc.params.secondaryImage
                ))

                ValidateImages([rpc.params.menuIcon]).then(
                    () => {this.listener.respondSuccess(rpc.method, rpc.id)},
                    () => {this.listener.send(RpcFactory.InvalidImageResponse(rpc))}
                );
                break;
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
                if (!rpc.params.choiceSet) {
                    return {"rpc": RpcFactory.ErrorResponse(rpc, 11, "No UI choices provided, VR choices are not supported")};
                }
                store.dispatch(performInteraction(
                    rpc.params.appID,
                    rpc.params.initialText,
                    rpc.params.choiceSet,
                    rpc.params.interactionLayout,
                    rpc.id,
                    rpc.params.cancelID,
                    rpc.params.timeout
                ))
                var timeout = rpc.params.timeout === 0 ? 15000 : rpc.params.timeout
                this.endTimes[rpc.id] = Date.now() + timeout;
                this.timers[rpc.id] = setTimeout(this.onPerformInteractionTimeout, timeout, rpc.id, rpc.params.appID)
                this.appsWithTimers[rpc.id] = rpc.params.appID
                this.onSystemContext("HMI_OBSCURED", rpc.params.appID)

                let performInteractionImages = [];
                rpc.params.choiceSet.forEach (choice => {
                    if (choice.image) { performInteractionImages.push(choice.image); }
                    if (choice.secondaryImage) { performInteractionImages.push(choice.secondaryImage); }
                });
                
                AddImageValidationRequest(rpc.id, performInteractionImages);

                break
            case "SetMediaClockTimer":
                store.dispatch(setMediaClockTimer(
                    rpc.params.appID,
                    rpc.params.startTime,
                    rpc.params.endTime,
                    rpc.params.updateMode,
                    rpc.params.audioStreamingIndicator,
                    rpc.params.forwardSeekIndicator,
                    rpc.params.backSeekIndicator,
                    rpc.params.countRate
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
                    rpc.params.menuLayout,
                    rpc.params.menuIcon,
                    rpc.params.keyboardProperties
                ))

                var warningsString;

                if (appUIState && appUIState.isPerformingInteraction && appUIState.interactionLayout === "KEYBOARD" && rpc.params.keyboardProperties) {
                    warningsString = "Keyboard properties are not applied while keyboard is in view."
                }
                
                ValidateImages([rpc.params.menuIcon]).then(
                    () => {
                        if (warningsString) {
                            this.listener.send(RpcFactory.ErrorResponse(rpc, 21, warningsString))
                        } else {
                            this.listener.respondSuccess(rpc.method, rpc.id)
                        }
                    },
                    () => {
                        this.listener.send(RpcFactory.InvalidImageResponse(rpc, warningsString))
                    }
                );
                break;
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
                if(!('softButtons' in rpc.params))
                this.timers[rpc.id] = setTimeout(this.onAlertTimeout, alertTimeout - RESPONSE_CORRELATION_MS, rpc.id, rpc.params.appID, context ? context : rpc.params.appID, false)
                
                this.appsWithTimers[rpc.id] = rpc.params.appID

                this.onSystemContext("ALERT", rpc.params.appID)

                if ((context !== rpc.params.appID) && context) {
                    this.onSystemContext("HMI_OBSCURED", context)
                }

                let alertImages = [rpc.params.alertIcon];
                if (rpc.params.softButtons) {
                    rpc.params.softButtons.forEach (softBtn => {
                        if (softBtn.image) { alertImages.push(softBtn.image); }
                    });
                }
                AddImageValidationRequest(rpc.id, alertImages);

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

                let subtleAlertImages = [rpc.params.alertIcon];
                if (rpc.params.softButtons) {
                    rpc.params.softButtons.forEach (softBtn => {
                        if (softBtn.image) { subtleAlertImages.push(softBtn.image); }
                    });
                }
                AddImageValidationRequest(rpc.id, subtleAlertImages)

                return null
            case "CancelInteraction":

                const state2 = store.getState()
                var app = state2.ui[state2.activeApp]
                
                if (rpc.params.functionID === 10 && app.isPerformingInteraction
                     && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.interactionCancelId)) {
                    clearTimeout(this.timers[app.interactionId])
                    delete this.timers[app.interactionId]
                    this.listener.send(RpcFactory.UIPerformInteractionCancelledResponse(app.interactionId))
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
            case 'SendHapticData':
                store.dispatch(setHapticData(rpc.params.appID, rpc.params.hapticRectData));
                return { rpc: RpcFactory.UISendHapticDataSuccess(rpc) }
            default:
                return false;
        }
    }
    onPerformInteractionTimeout(msgID, appID) {
        const state = store.getState()
        var activeApp = state.activeApp
        var app = state.ui[activeApp]
        var interactionId = app ? app.interactionId : null
        var interactionLayout = app ? app.interactionLayout : null
        if (msgID === interactionId.toString() && interactionLayout === "KEYBOARD") {
            this.onKeyboardInput("", "ENTRY_ABORTED")
        }

        delete this.timers[msgID]
        RemoveImageValidationResult(msgID)

        this.listener.send(RpcFactory.UIPerformInteractionTimeout(msgID))
        store.dispatch(timeoutPerformInteraction(
            msgID,
            appID
        ))
        this.onSystemContext("MAIN", appID)
    }
    onAlertTimeout(msgID, appID, context, isSubtle) {
        delete this.timers[msgID]

        let imageValidationSuccess = RemoveImageValidationResult(msgID)

        store.dispatch(closeAlert(
            msgID,
            appID
        ))
        const rpc = isSubtle
            ? RpcFactory.SubtleAlertResponse(msgID)
            : RpcFactory.AlertResponse(msgID, appID);
        this.listener.send((imageValidationSuccess) ? rpc : RpcFactory.InvalidImageResponse({ id: rpc.id, method: rpc.result.method }))

        const systemContext = getNextSystemContext();
        if (appID !== context) {
            this.onSystemContext(systemContext, appID)
        }
        this.onSystemContext(systemContext, context)
    }
    onStealFocus(alert, context, isSubtle) {        
        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]

        let imageValidationSuccess = RemoveImageValidationResult(alert.msgID)

        if (alert.buttonID) {
            this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName);
        } else { // can be invoked by clicking subtle alert modal
            this.listener.send(RpcFactory.OnSubtleAlertPressed(alert.appID));
        }

        store.dispatch(closeAlert(alert.msgID, alert.appID))

        const rpc = isSubtle
            ? RpcFactory.SubtleAlertResponse(alert.msgID)
            : RpcFactory.AlertResponse(alert.msgID, alert.appID);
        this.listener.send((imageValidationSuccess) ? rpc : RpcFactory.InvalidImageResponse({ id: rpc.id, method: rpc.result.method }));

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
        store.dispatch(closeAlert(alert.msgID, alert.appID));

        if (!alert.msgID) {
            // This was a system alert, do not send a response to Core
            return
        }

        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]

        let imageValidationSuccess = RemoveImageValidationResult(alert.msgID)

        if (alert.buttonID) { // can be invoked by clicking outside of subtle alert
            this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName);
        }

        const rpc = isSubtle
            ? RpcFactory.SubtleAlertResponse(alert.msgID)
            : RpcFactory.AlertResponse(alert.msgID, alert.appID);

        this.listener.send((imageValidationSuccess) ? rpc : RpcFactory.InvalidImageResponse({ id: rpc.id, method: rpc.result.method }));

        if(context){
            this.onSystemContext("MAIN", context)
        } else {
            this.onSystemContext("MENU")//Viewing App List
        }
    }
    onChoiceSelection(choiceID, appID, msgID, manualTextEntry) {
        clearTimeout(this.timers[msgID])
        delete this.timers[msgID]

        let imageValidationSuccess = RemoveImageValidationResult(msgID)
        let rpc = RpcFactory.UIPerformInteractionResponse(choiceID, appID, msgID, manualTextEntry)
        if(!imageValidationSuccess){
            rpc.result.code = 21; // WARNINGS
        }

        this.listener.send(rpc)
    }
    onSystemContext(context, appID) {
        if (context !== 'MAIN' && appID && appID === store.getState().activeApp) {
            this.onTouchCancel();
        }
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
        const state = store.getState()
        var activeApp = state.activeApp
        var app = state.ui[activeApp]
        var interactionId = app.interactionId
        for (var msgID in this.timers) {
            clearTimeout(this.timers[msgID])
            delete this.timers[msgID]
            RemoveImageValidationResult(msgID)
            if (msgID === interactionId.toString() && app.interactionLayout === "KEYBOARD") {
                this.onKeyboardInput("", "ENTRY_CANCELLED")
            }
            this.listener.send(RpcFactory.UIPerformInteractionAborted(parseInt(msgID)))
            store.dispatch(timeoutPerformInteraction(
                parseInt(msgID),
                this.appsWithTimers[msgID]
            ))
        }
    }

    onResetInteractionTimeout(appID, msgID) {
        clearTimeout(this.timers[msgID])
        const state = store.getState()
        const app = state.ui[appID]
        var timeout = app ? (app.interactionTimeout === 0 ? 15000 : app.interactionTimeout) : 15000;
        this.endTimes[msgID] = Date.now() + timeout;
        this.timers[msgID] = setTimeout(this.onPerformInteractionTimeout, timeout, msgID, appID)
        this.appsWithTimers[msgID] = appID
        this.onResetTimeout("appID", "UI.OnPerformInteraction")
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

    onDriverDistraction(ddState) {
        this.listener.send(RpcFactory.OnDriverDistraction(ddState))
    }

    onKeyboardInput(value, event) {
        this.listener.send(RpcFactory.OnKeyboardInput(value, event))
    }

    onTouchEvent(type, events) {
        this.listener.send(RpcFactory.OnTouchEvent(type, events));
    }

    onTouchCancel() {
        if (window.touchInProgress) {
            window.touchInProgress = false;
            this.onTouchEvent('CANCEL', [{
                id: 0,
                ts: [ parseInt(performance.now()) ],
                c: [ window.lastTouch ]
            }]);
        }
    }

    resetAlertTimeout() {
        let activeApp = store.getState().activeApp;
        let resPeriod = store.getState().ui[activeApp].resetTimeout.resetTimeoutValue;
        let messageId = store.getState().ui[activeApp].alert.msgID;

        clearTimeout(this.timers[messageId]);
        this.timers[messageId] = setTimeout(this.onAlertTimeout, resPeriod - RESPONSE_CORRELATION_MS, messageId, activeApp, activeApp, false)

        this.appsWithTimers[messageId] = activeApp;
        this.listener.send(RpcFactory.OnResetTimeout(messageId,'UI.Alert',resPeriod));
        // this.onSystemContext("ALERT", activeApp);

        // this.onSystemContext("ALERT", activeApp)

        // if (!activeApp) {
        //     this.onSystemContext("HMI_OBSCURED", activeApp)
        // }

        console.log(store.getState().ui[activeApp].alertTimeoutReseted.isAlertTimeoutReseted)
      

        // TODO:

        // let alertImages = [rpc.params.alertIcon];
        // if (rpc.params.softButtons) {
        //         rpc.params.softButtons.forEach (softBtn => {
        //             if (softBtn.image) { alertImages.push(softBtn.image); }
        //         });
        //     }
        // AddImageValidationRequest(messageId, alertImages);

    }
}

let controller = new UIController ()
export default controller
