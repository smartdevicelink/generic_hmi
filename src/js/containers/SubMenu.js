import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import HScrollMenu from '../HScrollMenu'
import uiController from '../Controllers/UIController'
import { deactivateSubMenu, deactivateInteraction, activateSubMenu } from '../actions'
import '../polyfill_find'
import capabilities from '../Controllers/DisplayCapabilities'

function SubmenuDeepFind(menu, parentID, depth) { 
    if (!menu || !parentID) {
        return null;
    }
    var deepSubMenu = null;
    var subMenu = menu.find((command) => {
        if (command.subMenu) { 
            var result = SubmenuDeepFind(command.subMenu, parentID, depth++)
            if (result && result.subMenu) {
                deepSubMenu = result;
                return true;
            }
        }
        return command.menuID === parentID
    });
    if (deepSubMenu) {
        return deepSubMenu;
    }
    if (subMenu) {
        return {
            subMenu: subMenu,
            depth: depth
        }
    }
    return null;
}

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp]
    var theme = state.theme

    if (!activeApp || !app) {
        return {data: [], isPerformingInteraction: false, theme: theme}
    }
    
    var link =  state.ui[activeApp].displayLayout
<<<<<<< HEAD
    var menuLength = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.menuLength;
    var menuDepthLimit = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.subMenuDepth - 1;
    if (app.isPerformingInteraction) {
        var data = app.choices.map((choice, index) => {
            var hidden = false;
            if (ddState === true && index >= menuLength) { 
                hidden = true;
            }
=======
    var data = null;
    if (app.isPerformingInteraction) {
        data = app.choices.map((choice) => {
>>>>>>> origin/develop
            return {
                appID: activeApp,
                cmdID: choice.choiceID,
                name: choice.menuName,
                image: choice.image ? choice.image.value : undefined,
                imageType: choice.image ? choice.image.imageType : undefined,
                isTemplate: choice.image ? choice.image.isTemplate : undefined,
                link: link,
                hidden: hidden
            }
        })
        return {
            data:data,
            isPerformingInteraction: true,
            interactionId: app.interactionId,
            theme: theme
        }
    }
    // The app isn't performing an interaction, so pass the sub menu items 
    var menu = app.menu
    var activeSubMenu = app.activeSubMenu
<<<<<<< HEAD
    var ddState = state.ddState;
    var data = SubmenuDeepFind(menu, activeSubMenu, 0).subMenu.subMenu.map((command, index) => {
        // Check DD state and set hidden param
        var hidden = false;
        var enabled = true;
        if (ddState === true && index >= menuLength) { 
            hidden = true;
        }
        if (ddState === true && command.subMenu && command.menuDepth >= menuDepthLimit) { 
            enabled = false;
        }
        if (command.subMenu) {
            link = '/inapplist'
        }
=======
    if (!activeSubMenu || !menu) {
        return {data: [], isPerformingInteraction: false, theme: theme}
    }
    data = menu.find((test) => {
        return test.menuID === activeSubMenu
    }).subMenu.map((command) => {
>>>>>>> origin/develop
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
            menuID: command.menuID
        }
    })
    return {data: data, isPerformingInteraction: false, theme: theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, menuID, enabled, isPerformingInteraction, interactionID) => {
            if (isPerformingInteraction) {
                uiController.onSystemContext("MAIN", appID)
                uiController.onChoiceSelection(cmdID, appID, interactionID)
                dispatch(deactivateInteraction(appID))
            } else if (menuID) {
                (enabled === true) ? dispatch(activateSubMenu(appID, menuID, 1)) : null;
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