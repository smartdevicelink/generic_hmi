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
        return {
            appID: app.appID,
            class: 'with-image',
            name: app.appName,
            image: icon,
            link: '/' + link,
            cmdID: 0,
            activeApp: state.activeApp,
            theme: state.theme,
            ui: state.ui     
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