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
    slider,
    closeSlider,
    setGlobalProperties,
    deactivateInteraction,
    showAppMenu,
    setHapticData,
    scrollableMessage,
    closeScrollableMessage,
    performAudioPassThru,
    closePerformAudioPassThru
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

class UIController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.failInteractions = this.failInteractions.bind(this)
        this.onPerformInteractionTimeout = this.onPerformInteractionTimeout.bind(this)
        this.onAlertTimeout = this.onAlertTimeout.bind(this)
        this.onSliderClose = this.onSliderClose.bind(this)
        this.onSliderKeepContext = this.onSliderKeepContext.bind(this)
        this.onDefaultAction = this.onDefaultAction.bind(this)
        this.onKeepContext = this.onKeepContext.bind(this)
        this.onStealFocus = this.onStealFocus.bind(this)
        this.onScrollableMessageStealFocus = this.onScrollableMessageStealFocus.bind(this);
        this.onCloseScrollableMessage = this.onCloseScrollableMessage.bind(this);
        this.onScrollableMessageKeepContext = this.onScrollableMessageKeepContext.bind(this);
        this.onClosePerformAudioPassThru = this.onClosePerformAudioPassThru.bind(this);
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
        const GENERIC_ERROR = 22;
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
            case "SubscribeButton":
            case "UnsubscribeButton":
                const isSubscribed = methodName === 'SubscribeButton';
                store.dispatch(subscribeButton(
                    rpc.params.appID,
                    rpc.params.buttonName,
                    isSubscribed
                ));
                if(!rpc.params.buttonName || !rpc.params.appID) {
                    this.listener.send(RpcFactory.ErrorResponse(rpc, GENERIC_ERROR, `No button provide to ${isSubscribed} ? 'subscribe' : 'unsubscribe'`));
                    return;
                };
                this.listener.send(RpcFactory.SuccessResponse(rpc));
                return 
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
            case "ScrollableMessage": {
                store.dispatch(scrollableMessage(
                    rpc.params.appID,
                    rpc.id,
                    rpc.params.messageText.fieldText,
                    rpc.params.softButtons,
                    rpc.params.timeout,
                    rpc.params.cancelID
                ));

                const state = store.getState();
                const context = state.activeApp

                var scrollableTimeout = rpc.params.timeout ?? 10000;
                this.endTimes[rpc.id] = Date.now() + scrollableTimeout;
                this.timers[rpc.id] = setTimeout(this.onCloseScrollableMessage, scrollableTimeout, rpc.id, rpc.params.appID, context);
                this.appsWithTimers[rpc.id] = rpc.params.appID;

                this.onSystemContext("HMI_OBSCURED", context)
                
                let scrollableButtonImages = [];
                if (rpc.params.softButtons) {
                    rpc.params.softButtons.forEach (softBtn => {
                        if (softBtn.image) { scrollableButtonImages.push(softBtn.image); }
                    });
                }
                AddImageValidationRequest(rpc.id, scrollableButtonImages);

                return null
            }
            case "PerformAudioPassThru": {
                this.aptMsgID = rpc.id;
                this.aptAppID = rpc.params.appID;
                store.dispatch(performAudioPassThru(
                    rpc.params.appID,
                    rpc.params.audioPassThruDisplayTexts,
                    rpc.params.maxDuration,
                    rpc.id
                ));

                const state = store.getState();
                const context = state.activeApp

                this.endTimes[rpc.id] = Date.now() + rpc.params.maxDuration;
                this.timers[rpc.id] = setTimeout(
                    this.onClosePerformAudioPassThru, 
                    rpc.params.maxDuration,
                    rpc.id,
                    rpc.params.appID,
                    context,
                    "TIMED_OUT"
                );
                this.appsWithTimers[rpc.id] = rpc.params.appID;

                this.onSystemContext("HMI_OBSCURED", context)
                return null;
            }
            case "EndAudioPassThru": {
                if (!this.aptAppID || !this.aptMsgID) {
                    return false;
                }
                const state = store.getState();
                const context = state.activeApp;
                this.onClosePerformAudioPassThru(
                    this.aptMsgID,
                    this.aptAppID,
                    context,
                    "SUCCESS"
                );
                return true;
            }
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
            case "Slider": {
                store.dispatch(slider(
                    rpc.params.appID,
                    rpc.params.numTicks,
                    rpc.params.position,
                    rpc.params.sliderHeader,
                    rpc.params.sliderFooter,
                    rpc.params.timeout,
                    rpc.id,
                    rpc.params.cancelID
                ))                
                const state = store.getState()
                const context = state.activeApp

                let sliderTimeout = rpc.params.timeout ? rpc.params.timeout : 10000
                this.endTimes[rpc.id] = Date.now() + sliderTimeout;
                this.timers[rpc.id] = setTimeout(this.onSliderClose, sliderTimeout, rpc.id, rpc.params.appID, 
                                            context ? context : rpc.params.appID, "TIMEOUT")
                this.appsWithTimers[rpc.id] = rpc.params.appID

                if ((context !== rpc.params.appID) && context) {
                    this.onSystemContext("HMI_OBSCURED", context)
                }

                return null
            }
            case "CancelInteraction":

                const state2 = store.getState()
                for(const appID in state2.ui) {
                    const app = state2.ui[appID];

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
                    } else if (rpc.params.functionID === 26 && app.slider.showSlider
                        && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.slider.cancelID)) {
                       clearTimeout(this.timers[app.slider.msgID])
                       delete this.timers[app.slider.msgID]
                       this.listener.send(RpcFactory.SliderAbortedResponse(app.slider.msgID))
                       store.dispatch(closeSlider(app.alert.msgID, rpc.params.appID))
                       const context = getNextSystemContext();
                       this.onSystemContext(context, rpc.params.appID)
                       return true
                    } else if (rpc.params.functionID === 25 && app.scrollableMessage.active
                        && (rpc.params.cancelID === undefined || rpc.params.cancelID === app.scrollableMessage.cancelID)) {
                      clearTimeout(this.timers[app.scrollableMessage.msgID]);
                      delete this.timers[app.scrollableMessage.msgID];
                      this.listener.send(RpcFactory.ScrollableMessageAbortedResponse(app.scrollableMessage.msgID));
                      store.dispatch(closeScrollableMessage(app.alert.msgID, rpc.params.appID));
                      const context = getNextSystemContext();
                      this.onSystemContext(context, state2.activeApp);
                      return true;
                    }
                }
                
                return { rpc: RpcFactory.UICancelInteractionIgnoredResponse(rpc) }
            case "ClosePopUp": {
                const state = store.getState()
                for(const appID in state.ui) {
                    const app = state.ui[appID];

                    const methodName = rpc.params?.methodName ? rpc.params.methodName :
                                    (app.alert.showAlert && !app.alert.isSubtle) ? "UI.Alert" :
                                    (app.alert.showAlert && app.alert.isSubtle) ? "UI.SubtleAlert" :
                                    (app.isPerformingInteraction) ? "UI.PerformInteraction":
                                    (app.slider.showSlider) ? "UI.Slider":
                                    (app.scrollableMessage.active) ? "UI.ScrollableMessage":
                                    //TODO: Add condition for UI PerformAudioPassThru interaction
                                    null
                    if (!methodName) {
                        continue;
                    }

                    switch (methodName) {
                        case "UI.Alert": {
                            if (!app.alert.showAlert || app.alert.isSubtle) {
                                return { rpc: RpcFactory.ErrorResponse(rpc, 4, "No active UI.Alert interaction to close") };
                            }
                            clearTimeout(this.timers[app.alert.msgID])
                            delete this.timers[app.alert.msgID]
                            this.listener.send(RpcFactory.AlertAbortedResponse(app.alert.msgID))
                            store.dispatch(closeAlert(app.alert.msgID, appID))
                            const context = getNextSystemContext();
                            this.onSystemContext(context, appID)
                            return true;
                        }
                        case "UI.SubtleAlert": {
                            if (!app.alert.showAlert || !app.alert.isSubtle) {
                                return { rpc: RpcFactory.ErrorResponse(rpc, 4, "No active UI.SubtleAlert interaction to close") };
                            }
                            clearTimeout(this.timers[app.alert.msgID])
                            delete this.timers[app.alert.msgID]
                            this.listener.send(RpcFactory.SubtleAlertErrorResponse(app.alert.msgID, 
                                5, 'subtle alert was cancelled'))
                            store.dispatch(closeAlert(app.alert.msgID, appID))
                            const context = getNextSystemContext();
                            this.onSystemContext(context, appID)
                            return true;
                        }
                        case "UI.PerformInteraction": {
                            if (!app.isPerformingInteraction) {
                                return { rpc: RpcFactory.ErrorResponse(rpc, 4, "No active UI.PerformInteraction interaction to close") };
                            }
                            clearTimeout(this.timers[app.interactionId])
                            delete this.timers[app.interactionId]
                            this.listener.send(RpcFactory.UIPerformInteractionCancelledResponse(app.interactionId))
                            store.dispatch(deactivateInteraction(appID))
                            this.onSystemContext("MAIN", appID)
                            return true;
                        }
                        case "UI.Slider": {
                            if (!app.slider.showSlider) {
                                return { rpc: RpcFactory.ErrorResponse(rpc, 4, "No active UI.Slider interaction to close") };
                            }
                            clearTimeout(this.timers[app.slider.msgID])
                            delete this.timers[app.slider.msgID]
                            this.listener.send(RpcFactory.SliderAbortedResponse(app.slider.msgID))
                            store.dispatch(closeSlider(app.alert.msgID, appID))
                            const context = getNextSystemContext();
                            this.onSystemContext(context, appID)
                            return true;
                        }
                        case "UI.ScrollableMessage": {
                            if (!app.scrollableMessage.active) {
                                return { rpc: RpcFactory.ErrorResponse(rpc, 4, "No active UI.ScrollableMessage interaction to close") };
                            }
                            clearTimeout(this.timers[app.scrollableMessage.msgID]);
                            delete this.timers[app.scrollableMessage.msgID];
                            this.listener.send(RpcFactory.ScrollableMessageAbortedResponse(app.scrollableMessage.msgID));
                            store.dispatch(closeScrollableMessage(app.alert.msgID, appID));
                            const context = getNextSystemContext();
                            this.onSystemContext(context, appID);
                            return true;
                        }
                        // TODO: Implement case for UI PerformAudioPassThru Interaction
                        // case "UI.PerformAudioPassThru": {
                        //     return true;
                        // }
                    }
                }
                return { rpc: RpcFactory.ErrorResponse(rpc, 4, "No active interaction to close") };;
            }
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
    onCloseScrollableMessage(msgID, appID, context) {   
        clearTimeout(this.timers[msgID])
        delete this.timers[msgID]

        let imageValidationSuccess = RemoveImageValidationResult(msgID)

        store.dispatch(closeScrollableMessage(
            msgID,
            appID
        ))
        const rpc = RpcFactory.ScrollableMessageResponse(msgID);
        this.listener.send((imageValidationSuccess) ? rpc : RpcFactory.InvalidImageResponse({ id: rpc.id, method: rpc.result.method }))

        const systemContext = getNextSystemContext();
        if (appID !== context) {
            this.onSystemContext(systemContext, appID)
        }
        this.onSystemContext(systemContext, context)
    }
    onClosePerformAudioPassThru(msgID, appID, context, resultCode) {
        this.aptMsgID = null;
        this.aptAppID = null;
        if (this.timers[msgID]) {
            clearTimeout(this.timers[msgID])
        }
        delete this.timers[msgID]
        store.dispatch(closePerformAudioPassThru(
            msgID,
            appID
        ));
        if (resultCode === "SUCCESS") {
            const rpc = RpcFactory.PerformAudioPassThruResponse(msgID);
            this.listener.send(rpc);
        } else {
            var info = "";
            var code = 22;
            if (resultCode === "ABORTED") {
                info = "PerformAudioPassThru was cancelled";
                code = 5;
            } else if (resultCode === "TIMED_OUT") {
                info = "PerformAudioPassThru timed out";
                code = 10;
            } else if (resultCode === "RETRY") {
                info = "User wanted to retry PerformAudioPassThru";
                code = 7;
            }
            const rpc = RpcFactory.ErrorResponse(
                {
                    method: "UI.PerformAudioPassThru",
                    id: msgID
                }, 
                code,
                info
            );
            this.listener.send(rpc);
        }
        const systemContext = getNextSystemContext();
        if (appID !== context) {
            this.onSystemContext(systemContext, appID)
        }
        this.onSystemContext(systemContext, context)
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

    onSliderClose(msgID, appID, context, reason) {
        clearTimeout(this.timers[msgID])
        delete this.timers[msgID]

        const state = store.getState()
        const app = state.ui[appID]
        const sliderPosition = app.slider?.position

        store.dispatch(closeSlider(
            msgID,
            appID
        ))

        let response;
        switch(reason){
            case "SUBMIT":
                response = RpcFactory.SliderResponse(msgID, sliderPosition) 
                break;
            case "ABORTED":
                response = RpcFactory.SliderAbortedResponse(msgID, sliderPosition)
                break;
            case "TIMEOUT":
                response = RpcFactory.SliderTimeoutResponse(msgID, sliderPosition)
                break;
            default:
                console.error("Unhandled response case for slider close")
                return;
        }
        this.listener.send(response)

        const systemContext = getNextSystemContext();
        if (appID !== context) {
            this.onSystemContext(systemContext, appID)
        }
        this.onSystemContext(systemContext, context)
    }
    onScrollableMessageStealFocus(msgID, appID) {
        this.onCloseScrollableMessage(msgID, appID);

        this.onSystemContext("MAIN", appID)
        sdlController.onAppActivated(appID)
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
    onSliderKeepContext(msgID, appID, duration) {
        clearTimeout(this.timers[msgID])
        
        let timeout = duration ? duration : 10000
        const state = store.getState();
        const context = state.activeApp

        this.timers[msgID] = setTimeout(this.onSliderClose, timeout, msgID, appID, context, "TIMEOUT");
        this.onResetTimeout(appID, "UI.Slider")
    }
    onScrollableMessageKeepContext(msgID, appID, duration) {
        clearTimeout(this.timers[msgID]);
        var timeout = duration ?? 10000;
        const state = store.getState();
        const context = state.activeApp;
        
        this.timers[msgID] = setTimeout(this.onCloseScrollableMessage, timeout, msgID, appID, context);
        this.onResetTimeout(appID, "UI.ScrollableMessage");
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
        this.onResetTimeout(appID, "UI.OnPerformInteraction")
    }

    onResetTimeout(appID, methodName) {
        this.listener.send(RpcFactory.OnResetTimeout(appID, "UI", methodName))
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
}

let controller = new UIController ()
export default controller
