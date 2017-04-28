import { connect } from 'react-redux'
import AppHeader from '../AppHeader'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {
        isPerformingInteraction: false,
        isDisconnected: false
    }

    var showAlert = false
    var alertAppName = ""
    for(var prop in state.ui){
        if(state.ui[prop].alert.showAlert){
            showAlert = true
            var alertApp = state.appList.find((key) => {
                return key.appID == prop
            })
            console.log("HEADER")
            if(alertApp.appName) {
                alertAppName = alertApp.appName
            }
            break
        }
    }

    var theme = state.theme

    return {
        isPerformingInteraction: app.isPerformingInteraction,
        isDisconnected: app.isDisconnected,
        displayLayout: app.displayLayout,
        showAlert: showAlert,
        alertName: alertAppName,
        theme: theme,
        activeApp: activeApp
        
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