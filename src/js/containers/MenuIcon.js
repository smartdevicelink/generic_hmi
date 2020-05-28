import { connect } from 'react-redux'
import uiController from '../Controllers/UIController'
import AppIcon from '../AppIcon'
import '../polyfill_find'
import { deactivateSubMenu } from '../actions';


const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var link =  activeApp ? state.ui[activeApp].displayLayout : "/"
    var icon = activeApp ? state.ui[activeApp].icon : null
    return {
        icon: icon ? icon.value : null,
        appID: activeApp,
        backLink: link,
        theme: state.theme,
        isTemplate: icon ? icon.isTemplate : null
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, path) => {
            dispatch(deactivateSubMenu(appID))

            if (path === "/inappmenu") {
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