import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import uiController from '../Controllers/UIController'
import { deactivateSubMenu } from '../actions'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var menu = state.ui[activeApp].menu
    var activeSubMenu = state.ui[activeApp].activeSubMenu
    var data = menu.find((test) => {
        return test.menuID === activeSubMenu
    }).subMenu.map((command) => {
        var link = '/media' // TODO: only supports media right now
        return {
            appID: activeApp,
            cmdID: command.cmdID,
            name: command.menuName,
            image: command.cmdIcon,
            link: link
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID) => {
            uiController.onSystemContext("MAIN", appID)
            uiController.onCommand(cmdID, appID)
            dispatch(deactivateSubMenu(appID))
        }
    }
}

const SubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export default SubMenu