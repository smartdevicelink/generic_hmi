import { connect } from 'react-redux'
import ControlBar from '../ControlBar'
//import SoftButtons from '../SoftButtons'
import SoftButtonsBody from '../Templates/Shared/SoftButtons'
import AlertButtonsBody from '../AlertButtons'
import uiController from '../Controllers/UIController'

import iconSeekLeft from '../../img/icons/icon-seek-left.svg';
import iconSeekRight from '../../img/icons/icon-seek-right.svg';
import iconPlay from '../../img/icons/icon-play.svg';
import iconPause from '../../img/icons/icon-pause.svg';

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var subscribedButtons = {}
    var softButtons = []
    var alertButtons = []
    var app = {}
    var graphicPresent
    if (activeApp) {
        subscribedButtons = state.ui[activeApp].subscribedButtons
        softButtons = state.ui[activeApp].softButtons
        app = state.ui[activeApp]
        graphicPresent = state.ui[activeApp].graphic ? true : false
    }
    // TODO: differentiate between types of softButtons and softButtons that use static images
    var buttons = []
    if (softButtons.length > 0) {
        buttons.push({
            class: "tertiary",
            name: "CUSTOM_BUTTON",
            image: softButtons[0].image ? softButtons[0].image.value : undefined,
            id: softButtons[0].softButtonID
        })
    }
    if (subscribedButtons.SEEKLEFT === true) {
        buttons.push({
            class: "secondary",
            name: "SEEKLEFT",
            icon: iconSeekLeft
        })
    }
    if (subscribedButtons.OK === true && app.updateMode === "PAUSE") {
        buttons.push({
            class: "primary",
            name: "OK",
            icon: iconPlay
        })
    }
    else if (subscribedButtons.OK === true) {
        buttons.push({
            class: "primary",
            name: "OK",
            icon: iconPause
        })
    }
    if (subscribedButtons.SEEKRIGHT === true) {
        buttons.push({
            class: "secondary",
            name: "SEEKRIGHT",
            icon: iconSeekRight
        })
    }
    if (softButtons.length > 1) {
        buttons.push({
            class: "tertiary",
            name: "CUSTOM_BUTTON",
            image: softButtons[1].image ? softButtons[1].image.value : undefined,
            id: softButtons[0].softButtonID
        })
    }

    for(var key in state.ui) {
        if(state.ui[key].alert.showAlert) {
            alertButtons = state.ui[key].alert.softButtons
            if(alertButtons.length > 0) {
                for (var i in alertButtons) {
                    alertButtons[i].msgID = state.ui[key].alert.msgID
                    //Set appID for app calling alert, not for the active app
                    alertButtons[i].appID = key.toString() 
                    alertButtons[i].duration = state.ui[key].alert.duration
                }
            }   
        }
    }

    return {buttons: buttons, softButtons: softButtons, appID: activeApp, graphicPresent: graphicPresent, alertButtons: alertButtons}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonPress: (appID, buttonID, buttonName) => {
            uiController.onButtonPress(appID, buttonID, buttonName)
        },
        onStealFocus:(alert, activeApp) =>{
            uiController.onStealFocus(alert, activeApp.toString())
        },
        onKeepContext:(alert) =>{
            uiController.onKeepContext(alert)
        },
        onDefaultAction:(alert, activeApp) =>{
            uiController.onDefaultAction(alert, activeApp.toString())
        }
    }
}

export const Buttons = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar)

export const SoftButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(SoftButtonsBody)

export const AlertButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertButtonsBody)

export default Buttons