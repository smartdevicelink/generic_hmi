import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'

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
            // TODO: switch app to full
            // TODO: send onCommand for cmdID
        }
    }
}

const SubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export default SubMenu