import { connect } from 'react-redux'
import AppHeader from '../AppHeader'

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
    return {
        isPerformingInteraction: app.isPerformingInteraction,
        isDisconnected: app.isDisconnected,
        displayLayout: app.displayLayout,
        showAlert: showAlert,
        alertName: alertAppName,
        theme: theme,
        activeApp: activeApp,
        colorScheme: colorScheme,
        alertIcon: alertIcon
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