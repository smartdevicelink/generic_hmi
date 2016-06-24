import { connect } from 'react-redux'
import HScrollMenuItem from '../HScrollMenuItem'
import { activateApp } from '../actions'
import bcController from '../Controllers/BCController'

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        activate: (appID) => {
            bcController.onAppActivated(appID)
            dispatch(activateApp(appID))
        }
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenuItem)

export default App