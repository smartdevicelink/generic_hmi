import { connect } from 'react-redux'
import uiController from '../Controllers/UIController'
import AppIcon from '../AppIcon'
import store from '../store'
import '../polyfill_find'


const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.appList.find((app) => {
        return app.appID === activeApp
    })
    var link =  activeApp ? state.ui[activeApp].displayLayout : "/"
    var icon = activeApp ? state.ui[activeApp].icon : null
    app = app ? app : {}
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
            const state = store.getState()
            const app = state.ui[state.activeApp]
            if (app) {
                app.activeSubMenu = null
            }

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