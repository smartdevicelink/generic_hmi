import { connect } from 'react-redux'
import AlertButtonsBody from '../AlertButtons'
import uiController from '../Controllers/UIController'

const mapStateToProps = (state) => {
    var alertButtons = []

    for(var key in state.ui) {
        if(state.ui[key].alert.showAlert) {
            alertButtons = state.ui[key].alert.softButtons
            var alertAppId = parseInt(key)
            if(alertButtons) {
                for (var i in alertButtons) {
                    alertButtons[i].appID = alertAppId
                    alertButtons[i].msgID = state.ui[key].alert.msgID
                    alertButtons[i].duration = state.ui[key].alert.duration
                }
            }
            break;
        }
    }

    return {alertButtons: alertButtons, theme: state.theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onStealFocus:(alert, context) =>{
            uiController.onStealFocus(alert, context, true);
        },
        onKeepContext:(alert) =>{
            uiController.onKeepContext(alert, true);
        },
        onDefaultAction:(alert) =>{
            uiController.onDefaultAction(alert, true);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertButtonsBody)