import { connect } from 'react-redux'
import uiController from '../Controllers/UIController'
import AppIcon from '../AppIcon'
import '../polyfill_find'
import { deactivateSubMenu } from '../actions';
import CheckForSubmenuNeedUpdate from '../Utils/CheckForSubmenuNeedUpdate';

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var link = activeApp ? state.ui[activeApp].displayLayout : "/"
    var icon = null
    if (activeApp) {
        icon = state.ui[activeApp].menuIcon ? 
            state.ui[activeApp].menuIcon : 
            state.ui[activeApp].icon
    }
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
        onSelection: (appID, path, activeSubMenu) => {
            //dispatch(deactivateSubMenu(appID))
            if (path === "/inappmenu") {
                uiController.onSystemContext("MENU", appID)
                CheckForSubmenuNeedUpdate(appID, 0);
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