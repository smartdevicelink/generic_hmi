import { connect } from 'react-redux'
import uiController from '../Controllers/UIController'
import AppIcon from '../AppIcon'
import '../polyfill_find'
<<<<<<< HEAD
import {deactivateSubMenu} from '../actions'
=======
import { deactivateSubMenu } from '../actions';
>>>>>>> origin/develop


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
<<<<<<< HEAD
        onSelection: (appID, path, activeSubMenu) => {
            if (path == "/inappmenu") {
=======
        onSelection: (appID, path) => {
            dispatch(deactivateSubMenu(appID))

            if (path === "/inappmenu") {
>>>>>>> origin/develop
                uiController.onSystemContext("MENU", appID)
            } else { //user exited menu
                uiController.onSystemContext("MAIN", appID)
            }

            if (activeSubMenu) {
                dispatch(deactivateSubMenu(appID))
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