import { connect } from 'react-redux'
import AppHeader from '../AppHeader'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {
        isPerformingInteraction: false,
        isDisconnected: false
    }

    var showAlert = false
    
    for(var prop in state.ui){
        if(state.ui[prop].alert.showAlert){
            showAlert = true
            break
        }
    }

    return {
        isPerformingInteraction: app.isPerformingInteraction,
        isDisconnected: app.isDisconnected,
        displayLayout: app.displayLayout,
        showAlert: showAlert
        
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