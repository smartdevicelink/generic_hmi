import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import HScrollMenu from '../HScrollMenu'
import uiController from '../Controllers/UIController'
import { deactivateSubMenu, deactivateInteraction, activateSubMenu } from '../actions'
import '../polyfill_find'
import {capabilities} from '../Controllers/DisplayCapabilities'
import SubmenuDeepFind from '../Utils/SubMenuDeepFind'
import CheckForSubmenuNeedUpdate from '../Utils/CheckForSubmenuNeedUpdate';

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp]
    var theme = state.theme

    if (!activeApp || !app) {
        return {data: [], isPerformingInteraction: false, theme: theme}
    }
    
    var link =  state.ui[activeApp].displayLayout
    var menuLength = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.menuLength;
    var menuDepthLimit = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.subMenuDepth - 1;
    if (app.isPerformingInteraction && app.choices) {
        var piData = app.choices.map((choice, index) => {
            var hidden = false;
            var secondaryImage = undefined;
            if (ddState === true && index >= menuLength) { 
                hidden = true;
            }
            if (choice.secondaryImage && choice.secondaryImage.value) {
                secondaryImage = {
                    value: choice.secondaryImage.value,
                    imageType: choice.secondaryImage.imageType,
                    isTemplate: choice.secondaryImage.isTemplate
                }
            }
            return {
                appID: activeApp,
                cmdID: choice.choiceID,
                name: choice.menuName,
                image: choice.image ? choice.image.value : undefined,
                imageType: choice.image ? choice.image.imageType : undefined,
                isTemplate: choice.image ? choice.image.isTemplate : undefined,
                link: link,
                hidden: hidden,
                secondaryText: choice.secondaryText,
                tertiaryText: choice.tertiaryText,
                secondaryImage: secondaryImage
            }
        })
        return {
            data: piData,
            isPerformingInteraction: true,
            interactionId: app.interactionId,
            theme: theme
        }
    }
    // The app isn't performing an interaction, so pass the sub menu items 
    var menu = app.menu
    var activeSubMenu = app.activeSubMenu
    if (!activeSubMenu) { // Perform Interaction timed out
        return {data: [], isPerformingInteraction: false, theme: theme}
    }
    var ddState = state.ddState;
    var subMenuData = SubmenuDeepFind(menu, activeSubMenu, 0).subMenu.subMenu.map((command, index) => {
        // Check DD state and set hidden param
        var hidden = false;
        var enabled = true;
        var secondaryImage = undefined;
        if (ddState === true && index >= menuLength) { 
            hidden = true;
        }
        if (ddState === true && command.subMenu && command.menuDepth >= menuDepthLimit - 1) { 
            enabled = false;
        }
        if (command.subMenu) {
            link = '/inapplist';
        } else {
            link = state.ui[activeApp].displayLayout
        }
        if (command.secondaryImage && command.secondaryImage.value) {
            secondaryImage = {
                value: command.secondaryImage.value,
                imageType: command.secondaryImage.imageType,
                isTemplate: command.secondaryImage.isTemplate
            }
        }
        
        return {
            appID: activeApp,
            cmdID: command.cmdID,
            name: command.menuName,
            image: command.cmdIcon ? command.cmdIcon.value : undefined,
            imageType: command.cmdIcon ? command.cmdIcon.imageType : undefined,
            isTemplate: command.cmdIcon ? command.cmdIcon.isTemplate : undefined,
            link: link,
            hidden: hidden,
            enabled: enabled,
            menuID: command.menuID,
            secondaryText: command.secondaryText,
            tertiaryText: command.tertiaryText,
            secondaryImage: secondaryImage
        }
    })
    return {data: subMenuData, isPerformingInteraction: false, theme: theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, menuID, enabled, isPerformingInteraction, interactionID) => {
            if (isPerformingInteraction) {
                uiController.onSystemContext("MAIN", appID)
                uiController.onChoiceSelection(cmdID, appID, interactionID)
                dispatch(deactivateInteraction(appID))
            } else if (menuID && enabled === true) {
                dispatch(activateSubMenu(appID, menuID, 1));
                CheckForSubmenuNeedUpdate(appID, menuID);
            } else {
                uiController.onSystemContext("MAIN", appID)
                uiController.onCommand(cmdID, appID)
                dispatch(deactivateSubMenu(appID))
            }
        }
    }
}

export const VSubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export const HSubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default VSubMenu