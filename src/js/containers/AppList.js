import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import sdlController from '../Controllers/SDLController'

const mapStateToProps = (state) => {
    var data = state.appList.map ((app, index) => {
        var icon = ""
        if (app.icon) {
            icon = app.icon.replace("local:", "file:")
        }
        var defaultLink = app.isMediaApplication ? "media" : "nonmedia";
        var link = "media"
        if (state.ui[app.appID]) {
            link = state.ui[app.appID].displayLayout ? state.ui[app.appID].displayLayout : defaultLink
        }
        var name = app.isCloudApplication ? app.appName + " (Cloud)" : app.appName;
        return {
            appID: app.appID,
            class: 'with-image',
            name: name,
            image: icon,
            link: '/' + link,
            cmdID: app.appID
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