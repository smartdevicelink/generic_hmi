import { connect } from 'react-redux'
import ControlBar from '../ControlBar'
import SoftButtons from '../SoftButtons'
import uiController from '../Controllers/UIController'

import iconSeekLeft from '../../img/icons/icon-seek-left.svg';
import iconSeekRight from '../../img/icons/icon-seek-right.svg';
import iconPlay from '../../img/icons/icon-play.svg';
import iconPause from '../../img/icons/icon-pause.svg';

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var subscribedButtons = {}
    var softButtons = []
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
    return {buttons: buttons, softButtons: softButtons, appID: activeApp, graphicPresent: graphicPresent}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonPress: (appID, buttonID, buttonName) => {
            uiController.onButtonPress(appID, buttonID, buttonName)
        }
    }
}

export const Buttons = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar)

export const NonMediaSoftButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(SoftButtons)

export default Buttons