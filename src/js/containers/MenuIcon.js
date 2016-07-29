import { connect } from 'react-redux'
import uiController from '../Controllers/UIController'
import AppIcon from '../AppIcon'
import '../polyfill_find'


const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.appList.find((app) => {
        return app.appID === activeApp
    })
    app = app ? app : {}
    return {
        icon: app.icon,
        appID: activeApp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID) => {
            uiController.onSystemContext("MENU", appID)
        }
    }
}

export const MenuIcon = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppIcon)

export default MenuIcon