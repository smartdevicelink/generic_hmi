import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import bcController from '../Controllers/BCController'

const mapStateToProps = (state) => {
    var data = state.appList.map ((app, index) => {
        var icon = app.icon
        return {
            appID: app.appID,
            class: 'with-image',
            name: app.appName,
            image: icon,
            link: '/media',
            cmdID: 0
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID) => {
            bcController.onAppActivated(appID)
        }
    }
}

const AppList = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default AppList