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

    return {alertButtons: alertButtons, theme: state.theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onStealFocus:(alert, context) =>{
            uiController.onSubtleAlertStealFocus(alert, context)
        },
        onKeepContext:(alert) =>{
            uiController.onSubtleAlertKeepContext(alert)
        },
        onDefaultAction:(alert) =>{
            uiController.onSubtleDefaultAction(alert)
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertButtonsBody)