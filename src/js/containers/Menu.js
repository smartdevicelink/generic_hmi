import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import uiController from '../Controllers/UIController'
import { activateSubMenu } from '../actions'
import capabilities from '../Controllers/DisplayCapabilities'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var ddState = state.ddState;
    var menuLength = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.menuLength;
    var menuDepth = capabilities["COMMON"].systemCapabilities.driverDistractionCapability.subMenuDepth;
    var menu = state.ui[activeApp].menu
    var theme = state.theme
    var data = menu.map((command, index) => {
        // Check DD state and set hidden param
        var hidden = false;

        if (ddState === true && index >= menuLength) { 
            hidden = true;
        }

        var dataClass = null
        if (command.cmdIcon) {
            dataClass = 'with-icon'
        }
        var link =  state.ui[activeApp].displayLayout
        var enabled = true
        if (command.subMenu) {
            link = '/inapplist'
            if (ddState === true && menuDepth === 1) {
                enabled = false;
            }
        }
        return {
            cmdID: command.cmdID,
            class: dataClass,
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

const Menu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export default Menu