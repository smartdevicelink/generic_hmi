import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import uiController from '../Controllers/UIController'
import { activateSubMenu } from '../actions'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var menu = state.ui[activeApp].menu
    var data = menu.map((command) => {
        var dataClass = null
        if (command.cmdIcn) {
            dataClass = 'with-icon'
        }
        var link = '/media' // TODO: only supports media right now
        if (command.subMenu) {
            link = '/inapplist'
        }
        return {
            cmdID: command.cmdID,
            class: dataClass,
            name: command.menuName,
            image: command.cmdIcon ? command.cmdIcon.value : undefined,
            appID: activeApp,
            link: link,
            menuID: command.menuID
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, menuID) => {
            if (menuID) {
                dispatch(activateSubMenu(appID, menuID))
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