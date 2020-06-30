import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import HScrollMenu from '../HScrollMenu'
import uiController from '../Controllers/UIController'
import { activateSubMenu } from '../actions'
import {capabilities}  from '../Controllers/DisplayCapabilities'
import UIController from '../Controllers/UIController'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var ddState = state.ddState;
    var menuLength = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.menuLength;
    var menuDepth = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.subMenuDepth;
    var menu = state.ui[activeApp].menu
    var theme = state.theme
    var data = menu.map((command, index) => {
        // Check DD state and set hidden param
        var hidden = (ddState === true && index >= menuLength) ? true : false;
        var link =  state.ui[activeApp].displayLayout
        var enabled = true
        if (command.subMenu) {
            link = '/inapplist'
            if (ddState === true && menuDepth === 1) {
                enabled = false;
            }

            if (command.subMenu.length === 0) {
                // Found and empty submenu, ask app to send add commands
                UIController.onUpdateSubMenu(activeApp, command.menuID);
            }
        }
        return {
            cmdID: command.cmdID,
            name: command.menuName,
            image: command.cmdIcon ? command.cmdIcon.value : undefined,
            imageType: command.cmdIcon ? command.cmdIcon.imageType : undefined,
            isTemplate: command.cmdIcon ? command.cmdIcon.isTemplate : undefined,
            appID: activeApp,
            link: link,
            menuID: command.menuID,
            hidden: hidden,
            enabled: enabled
        }
    })
    return {data: data, theme: theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, menuID, enabled) => {
            if (!enabled && menuID) { // Dont allow selection of a disabled submenu
                return;
            }
            else if (menuID) {
                dispatch(activateSubMenu(appID, menuID, 1))
            }
            else if (cmdID) {
                uiController.onSystemContext("MAIN", appID)
                uiController.onCommand(cmdID, appID)
            }
        }
    }
}

export const VMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export const HMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default VMenu