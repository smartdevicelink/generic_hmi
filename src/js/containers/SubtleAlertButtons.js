import { connect } from 'react-redux'
import AlertButtonsBody from '../AlertButtons'
import uiController from '../Controllers/UIController'

const mapStateToProps = (state) => {
    var alertButtons = []

    for(var key in state.ui) {
        if(state.ui[key].alert.showAlert) {
            alertButtons = state.ui[key].alert.softButtons
            if(alertButtons) {
                for (var i in alertButtons) {
                    alertButtons[i].appID = parseInt(key)
                    alertButtons[i].msgID = state.ui[key].alert.msgID
                    alertButtons[i].duration = state.ui[key].alert.duration
                }
            }   
        }
    }

    var app = state.ui[state.activeApp];
    var colorScheme = null;
    if (state.theme === true) { //Dark theme
        if(app.nightColorScheme) {
            colorScheme = {}
            if(app.nightColorScheme.primaryColor) {
                colorScheme["primary"] = app.nightColorScheme.primaryColor
            }
            if(app.nightColorScheme.secondaryColor) {
                colorScheme["secondary"] = app.nightColorScheme.secondaryColor
            }
        }
    } else {
        if(app.dayColorScheme) { //Light theme
            colorScheme = {}
            if(app.dayColorScheme.primaryColor) {
                colorScheme["primary"] = app.dayColorScheme.primaryColor
            }
            if(app.dayColorScheme.secondaryColor) {
                colorScheme["secondary"] = app.dayColorScheme.secondaryColor
            }
        }
    }

    return {alertButtons: alertButtons, theme: state.theme, colorScheme: colorScheme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onStealFocus:(alert, context) =>{
            uiController.onStealFocus(alert, context, true);
        },
        onKeepContext:(alert) =>{
            uiController.onKeepContext(alert, true);
        },
        onDefaultAction:(alert, context) =>{
            uiController.onDefaultAction(alert, context, true);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertButtonsBody)