import { connect } from 'react-redux'
import ControlBar from '../ControlBar'
//import SoftButtons from '../SoftButtons'
import SoftButtonsBody from '../Templates/Shared/SoftButtons'
import AlertButtonsBody from '../AlertButtons'
import ScrollableMessageButtons from '../ScrollableMessageButtons'
import uiController from '../Controllers/UIController'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var subscribedButtons = {}
    var softButtons = []
    var alertButtons = []
    var scrollableMessageButtons = [];
    var app = {}
    var graphicPresent
    if (activeApp) {
        subscribedButtons = state.ui[activeApp].subscribedButtons;
        softButtons = state.ui[activeApp].softButtons
        app = state.ui[activeApp]
        graphicPresent = state.ui[activeApp].graphic ? true : false
    }

    var buttons = []
    if (softButtons.length > 0 && subscribedButtons.CUSTOM_BUTTON === true) {
        buttons.push({
            class: "tertiary",
            name: "CUSTOM_BUTTON",
            image: softButtons[0].image ? softButtons[0].image.value : undefined,
            imageType: softButtons[0].image ? softButtons[0].image.imageType : undefined,
            id: softButtons[0].softButtonID,
            isTemplate: softButtons[0].image ? softButtons[0].image.isTemplate : null
        })
    }
    if (subscribedButtons.SEEKLEFT === true) {
        let icon = (app.backSeekIndicator.type === "TIME") ? "iconSeekLeft" : "iconSkipLeft"
        let iconProps = {}
        if (app.backSeekIndicator.seekTime) {
            iconProps.seekTime = app.backSeekIndicator.seekTime.toString().padStart(2, '0')
        }
        buttons.push({
            class: "secondary",
            name: "SEEKLEFT",
            icon: icon,
            iconProps: iconProps
        })
    }
    if (subscribedButtons.OK === true || subscribedButtons.PLAY_PAUSE === true) {
        var buttonName = ""
        if (subscribedButtons.PLAY_PAUSE === true) {
            buttonName = "PLAY_PAUSE"
        } else {
            buttonName = "OK"
        }
        if (app.audioStreamingIndicator) {
            if (app.audioStreamingIndicator === "PLAY") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: "iconPlay"
                })
            } else if (app.audioStreamingIndicator === "PAUSE") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: "iconPause"
                })                
            } else if (app.audioStreamingIndicator === "STOP") {
                buttons.push({
                    class: "square",
                    name: buttonName,
                    icon: "iconStop"
                })                
            } else if (app.audioStreamingIndicator === "PLAY_PAUSE") {
                buttons.push({
                    class: "double",
                    name: buttonName,
                    icon: "iconPlayPause"
                })                
            } else {
                buttons.push({
                    class: "double",
                    name: buttonName,
                    icon: "iconPlayPause"
                })                    
            }
        } 
        else if (app.updateMode) {
            if (app.updateMode === "COUNTUP") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: "iconPause"
                })                    
            } else if (app.updateMode === "COUNTDOWN") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: "iconPause"
                })                    
            } else if (app.updateMode === "RESUME") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: "iconPause"
                })                    
            } else if (app.updateMode === "PAUSE") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: "iconPlay"
                })                    
            } else {
                buttons.push({
                    class: "double",
                    name: buttonName,
                    icon: "iconPlayPause"
                })                    
            }
        } else {
            buttons.push({
                class: "double",
                name: buttonName,
                icon: "iconPlayPause"
            })                    
        }
    }
    if (subscribedButtons.SEEKRIGHT === true) {
        let icon = (app.forwardSeekIndicator.type === "TIME") ? "iconSeekRight" : "iconSkipRight"
        let iconProps = {}
        if (app.forwardSeekIndicator.seekTime) {
            iconProps.seekTime = app.forwardSeekIndicator.seekTime.toString().padStart(2, '0')
        }
        buttons.push({
            class: "secondary",
            name: "SEEKRIGHT",
            icon: icon,
            iconProps: iconProps
        })
    }
    if (softButtons.length > 1 && subscribedButtons.CUSTOM_BUTTON === true) {
        buttons.push({
            class: "tertiary",
            name: "CUSTOM_BUTTON",
            image: softButtons[1].image ? softButtons[1].image.value : undefined,
            imageType: softButtons[1].image ? softButtons[1].image.imageType : undefined,
            id: softButtons[1].softButtonID,
            isTemplate: softButtons[1].image ? softButtons[1].image.isTemplate : null
        })
    }

    for(var key in state.ui) {
        if(state.ui[key].alert.showAlert) {
            alertButtons = state.ui[key].alert.softButtons
            if(alertButtons) {
                for (var i in alertButtons) {
                    alertButtons[i].msgID = state.ui[key].alert.msgID
                    //Set appID for app calling alert, not for the active 
                    alertButtons[i].appID = parseInt(key) 
                    alertButtons[i].duration = state.ui[key].alert.duration
                }
            }   
        }
        if (state.ui[key].scrollableMessage.active) {
            scrollableMessageButtons = state.ui[key].scrollableMessage.softButtons;
            if (scrollableMessageButtons) {
                for (var i in scrollableMessageButtons) {
                    scrollableMessageButtons[i].appID = parseInt(key);
                    scrollableMessageButtons[i].msgID = state.ui[key].scrollableMessage.msgID;
                    scrollableMessageButtons[i].duration = state.ui[key].scrollableMessage.duration;
                }
            }
        }
    }

    //Assign color scheme to props
    var theme = state.theme
    var colorScheme = null;
    if (theme === true) { //Dark theme
        if(app.nightColorScheme) {
            colorScheme = {}
            if(app.nightColorScheme.primaryColor) {
                colorScheme["primary"] = app.nightColorScheme.primaryColor
            }
            if(app.nightColorScheme.secondaryColor) {
                colorScheme["secondary"] = app.nightColorScheme.secondaryColor
            }
        }
    } else {
        if(app.dayColorScheme) { //Light theme
            colorScheme = {}
            if(app.dayColorScheme.primaryColor) {
                colorScheme["primary"] = app.dayColorScheme.primaryColor
            }
            if(app.dayColorScheme.secondaryColor) {
                colorScheme["secondary"] = app.dayColorScheme.secondaryColor
            }
        }
    }

    return {buttons: buttons, softButtons: softButtons, appID: activeApp, graphicPresent: graphicPresent, alertButtons: alertButtons, scrollableMessageButtons: scrollableMessageButtons, colorScheme: colorScheme, theme: state.theme}
}

var buttonPressMap = {};

const onLongButtonPress = (appID, buttonID, buttonName) => {
    // int cast to string to index json object
    var appIDStr = appID.toString();
    var buttonIDStr = buttonID ? buttonID.toString() : "HARD_BUTTON";
    if (buttonPressMap[appIDStr][buttonIDStr].hasOwnProperty(buttonName) 
        && buttonPressMap[appIDStr][buttonIDStr][buttonName]) {
        buttonPressMap[appIDStr][buttonIDStr][buttonName] = null;
        uiController.onLongButtonPress(appID, buttonID, buttonName);
    }    
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonDown: (appID, buttonID, buttonName) => {
            // int cast to string to index json object
            var appIDStr = appID.toString();
            var buttonIDStr = buttonID ? buttonID.toString() : "HARD_BUTTON";
            buttonPressMap[appIDStr] = buttonPressMap[appIDStr] ? buttonPressMap[appIDStr] : {};
            buttonPressMap[appIDStr][buttonIDStr] = buttonPressMap[appIDStr][buttonIDStr] ? buttonPressMap[appIDStr][buttonIDStr] : {};
            // Save timeout to clear later
            buttonPressMap[appIDStr][buttonIDStr][buttonName] = setTimeout(onLongButtonPress, 3000, appID, buttonID, buttonName);
            uiController.onButtonEventDown(appID, buttonID, buttonName);
        },
        onButtonUp: (appID, buttonID, buttonName) => {
            // int cast to string to index json object
            var appIDStr = appID.toString();
            var buttonIDStr = buttonID ? buttonID.toString() : "HARD_BUTTON";
            if (buttonPressMap[appIDStr][buttonIDStr][buttonName]) {
                // Short press, clear long press timeout
                clearTimeout(buttonPressMap[appIDStr][buttonIDStr][buttonName]);
                buttonPressMap[appIDStr][buttonIDStr][buttonName] = null;
                uiController.onShortButtonPress(appID, buttonID, buttonName)
            }
            uiController.onButtonEventUp(appID, buttonID, buttonName);
            delete buttonPressMap[appIDStr][buttonIDStr][buttonName];
            
        },
        onButtonPress: (appID, buttonID, buttonName) => {
            uiController.onButtonPress(appID, buttonID, buttonName)
        },
        onStealFocus:(alert, activeApp) =>{
            uiController.onStealFocus(alert, activeApp ? activeApp : null, false)
        },
        onKeepContext:(alert) =>{
            uiController.onKeepContext(alert, false)
        },
        onDefaultAction:(alert, activeApp) =>{
            uiController.onDefaultAction(alert, activeApp ? activeApp : null, false)
        }
    }
}

export const Buttons = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar)

export const ScrollableButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScrollableMessageButtons)

export const SoftButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(SoftButtonsBody)

export const AlertButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertButtonsBody)

export default Buttons
