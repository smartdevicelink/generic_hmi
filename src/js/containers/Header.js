import { connect } from 'react-redux'
import AppHeader from '../AppHeader'

function SubmenuDeepFind(menu, parentID, depth) { 
    if (!menu || !parentID) {
        return null;
    }
    var deepSubMenu = null;
    var subMenu = menu.find((command) => {
        if (command.subMenu) { 
            var result = SubmenuDeepFind(command.subMenu, parentID, depth++)
            if (result && result.subMenu) {
                deepSubMenu = result;
                return true;
            }
        }
        return command.menuID === parentID
    });
    if (deepSubMenu) {
        return deepSubMenu;
    }
    if (subMenu) {
        return {
            subMenu: subMenu,
            depth: depth
        }
    }
    return null;
}

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {
        isPerformingInteraction: false,
        isDisconnected: true,
        displayLayout: ""
    }

    var showAlert = false
    var alertAppName = ""
    var alertIcon = { imageType: "STATIC", value: "0xFE" }
    for(var prop in state.ui){
        if(state.ui[prop].alert.showAlert){
            showAlert = true
            var alertApp = state.appList.find((key) => {
                return key.appID == prop
            })

            if(alertApp.appName) {
                alertAppName = alertApp.appName
            }

            if (state.ui[prop].alert.icon) {
                alertIcon = state.ui[prop].alert.icon
            }

            break
        }
    }

    var theme = state.theme
    var colorScheme = null;
    var triggerShowAppMenu = (state.ui[activeApp]) ? state.ui[activeApp].triggerShowAppMenu : false;
    var activeSubMenu = (state.ui[activeApp]) ? state.ui[activeApp].activeSubMenu : null;
    
    if (theme === true) { //Dark theme
        if(app.nightColorScheme) {
            if(app.nightColorScheme.backgroundColor) {
                colorScheme = app.nightColorScheme.backgroundColor
            }
        }
    } else {
        if(app.dayColorScheme) {
            if(app.dayColorScheme.backgroundColor) {
                colorScheme = app.dayColorScheme.backgroundColor
            }
        }
    }

    var subMenu = null;
    var parentID = null;
    if (app.activeSubMenu) {
        subMenu = SubmenuDeepFind(app.menu, app.activeSubMenu, 0);
    }

    if (subMenu) {
        parentID = subMenu.subMenu.parentID;
    }

    return {
        isPerformingInteraction: app.isPerformingInteraction,
        isDisconnected: app.isDisconnected,
        displayLayout: app.displayLayout,
        showAlert: showAlert,
        alertName: alertAppName,
        theme: theme,
        activeApp: activeApp,
        colorScheme: colorScheme,
        triggerShowAppMenu: triggerShowAppMenu,
        activeSubMenu: activeSubMenu,
        alertIcon: alertIcon,
        activeMenuDepth: app.activeMenuDepth,
        parentID: parentID,
        activeLayout: app.displayLayout        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Header = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeader)

export default Header