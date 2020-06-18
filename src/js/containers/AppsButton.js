import { connect } from 'react-redux'
import bcController from '../Controllers/BCController'
import uiController from '../Controllers/UIController'
import AppMenuLink from '../AppMenuLink'

import { activateSubMenu, deactivateSubMenu} from '../actions'

const mapStateToProps = (state) => {
    return {
        appID: state.activeApp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
<<<<<<< HEAD
        onSelection: (appID, backLink, parentID) => {
             if (backLink === "/inapplist" && parentID) { // submenu -> submenu
                dispatch(activateSubMenu(appID, parentID, -1));
            } else if (backLink === "/inappmenu") { // submenu -> menu
                dispatch(deactivateSubMenu(appID))
                uiController.onSystemContext("MENU", appID)
            } else if (backLink === "/") { // app view -> app list
                uiController.onSystemContext("MAIN", appID)
                uiController.failInteractions()
                bcController.onAppDeactivated("GENERAL", appID)
            } else { // menu -> app view (backLink is any of the layout names)
                uiController.onSystemContext("MAIN", appID)
                uiController.failInteractions()
=======
        onSelection: (appID) => {
            uiController.onSystemContext("MAIN", appID)
            uiController.failInteractions()
            if (appID) {
                bcController.onAppDeactivated("GENERAL", appID)
>>>>>>> origin/develop
            }
        }
    }
}

const AppsButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppMenuLink)

export default AppsButton