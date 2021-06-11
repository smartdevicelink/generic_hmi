import { connect } from 'react-redux'
import AppHeader from '../AppHeader'
import SubmenuDeepFind from '../Utils/SubMenuDeepFind'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {
        isPerformingInteraction: false,
        isDisconnected: true,
        displayLayout: ""
    }

    var showAlert = false
    var alertIsSubtle = false
    var alertMsgId = null
    var alertAppId = null
    var alertAppName = ""
    var alertIcon = null
    var showSlider = false
    var sliderAppId = null
    var sliderAppName = ""
    var sliderData = {}
    for(const prop in state.ui){
        if(state.ui[prop].alert.showAlert){
            showAlert = true
            alertIsSubtle = state.ui[prop].alert.isSubtle
            alertMsgId = state.ui[prop].alert.msgID
            alertAppId = parseInt(prop)

            var alertApp = state.appList.find((key) => {
                return key.appID === parseInt(prop)
            })

            if(alertApp.appName) {
                alertAppName = alertApp.appName
            }

            if (state.ui[prop].alert.icon) {
                alertIcon = state.ui[prop].alert.icon
            }

            break
        }
        if (state.ui[prop].slider.showSlider) {
            showSlider = true

            sliderAppId = parseInt(prop)
            var sliderApp = state.appList.find((key) => {
                return key.appID === parseInt(prop)
            })

            if (sliderApp.appName) {
                sliderAppName = sliderApp.appName
            }

            sliderData = state.ui[prop].slider
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
        alertIsSubtle: alertIsSubtle,
        alertMsgId: alertMsgId,
        alertAppId: alertAppId,
        alertName: alertAppName,
        showSlider: showSlider,
        sliderAppId: sliderAppId,
        sliderName: sliderAppName,
        sliderData: sliderData,
        theme: theme,
        activeApp: activeApp,
        colorScheme: colorScheme,
        triggerShowAppMenu: triggerShowAppMenu,
        activeSubMenu: activeSubMenu,
        alertIcon: alertIcon,
        activeMenuDepth: app.activeMenuDepth,
        parentID: parentID,
        activeLayout: app.displayLayout,
        interactionLayout: app.interactionLayout
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
