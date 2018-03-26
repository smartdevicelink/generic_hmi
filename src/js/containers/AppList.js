import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import sdlController from '../Controllers/SDLController'

const mapStateToProps = (state) => {
    var data = state.appList.map ((app, index) => {
        var icon = ""
        if (app.icon) {
            icon = app.icon.replace("local:", "file:")
        }
        if (state.ui[app.appID].displayLayout == null) {
            state.ui[app.appID].displayLayout = app.isMediaApplication ? "media" : "nonmedia"
        }
        return {
            appID: app.appID,
            class: 'with-image',
            name: app.appName,
            image: icon,
            link: '/' + state.ui[app.appID].displayLayout,
            cmdID: 0
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID) => {
            sdlController.onAppActivated(appID)
        }
    }
}

const AppList = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default AppList