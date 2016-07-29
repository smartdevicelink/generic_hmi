import { connect } from 'react-redux'
import bcController from '../Controllers/BCController'
import AppMenuLink from '../AppMenuLink'

const mapStateToProps = (state) => {
    return {
        appID: state.activeApp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID) => {
            bcController.onAppDeactivated("GENERAL", appID)
        }
    }
}

const AppsButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppMenuLink)

export default AppsButton