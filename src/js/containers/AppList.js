import { connect } from 'react-redux'
import store from '../store'
import HScrollMenu from '../HScrollMenu'
import { webEngineAppLaunch } from '../actions'
import sdlController from '../Controllers/SDLController'

const mapStateToProps = (state) => {
    var data = state.appList.map ((app, index) => {
        var icon = ""
        if (app.icon) {
            icon = app.icon.replace("local:", "file:")
        } else {
            var appDirEntry = state.appStore.installedApps.find(x => x.policyAppID == app.policyAppID);
            if (appDirEntry) {
                icon = appDirEntry.iconUrl;
            }
        }
        var defaultLink = app.isMediaApplication ? "media" : "nonmedia";
        var link = "media"
        if (state.ui[app.appID]) {
            link = state.ui[app.appID].displayLayout ? state.ui[app.appID].displayLayout : defaultLink
        }
        var name = app.isCloudApplication ? app.appName + " (Cloud)" : app.appName;
        var devicename = (app.deviceInfo.name.trim()) ? app.deviceInfo.name 
            : app.deviceInfo.transportType + ": " + app.deviceInfo.id.substring(0, 10) + "...";
        return {
            appID: app.appID,
            class: 'with-image',
            name: name,
            devicename: devicename,
            image: icon,
            link: '/' + link,
            cmdID: app,
            greyOut: app.greyOut
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, app) => {
            let state = store.getState();
            var webEngineApp = state.appStore.installedApps.find(x => x.policyAppID === app.policyAppID);

            if (!webEngineApp || webEngineApp.runningAppId) {
                sdlController.onAppActivated(appID)
                return;
            }

            dispatch(webEngineAppLaunch(app.policyAppID, appID));

            var activateAppOnceRegistered = setInterval(() => {
                if (!app.isRegistered) {
                    return;
                }
                
                sdlController.onAppActivated(app.appID);
                clearInterval(activateAppOnceRegistered);
            }, 250);
        }
    }
}

const AppList = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default AppList