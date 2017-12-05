import { connect } from 'react-redux'
import uiController from '../Controllers/UIController'
import AppIcon from '../AppIcon'
import '../polyfill_find'


const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.appList.find((app) => {
        return app.appID === activeApp
    })
    var link =  state.ui[activeApp].displayLayout
    app = app ? app : {}
    return {
        icon: app.icon,
        appID: activeApp,
        backLink: link
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, path) => {
            if (path == "/inappmenu") {
                uiController.onSystemContext("MENU", appID)
            } else { //user exited menu
                uiController.onSystemContext("MAIN", appID)
            }
            uiController.failInteractions()
        }
    }
}

export const MenuIcon = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppIcon)

export default MenuIcon