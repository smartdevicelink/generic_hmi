import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import bcController from '../Controllers/BCController'
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
            image: command.cmdIcon,
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
                // TODO: call onCommand
                // TODO: onContext switch to full
            }
            
        }
    }
}

const Menu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default Menu