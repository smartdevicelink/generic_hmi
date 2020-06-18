import { connect } from 'react-redux'
import store from '../store'
import HScrollMenu from '../HScrollMenu'
import { webEngineAppLaunch, setPendingAppLaunch } from '../actions'
import sdlController from '../Controllers/SDLController'

const mapStateToProps = (state) => {
    var appList = state.appList;

    if (!state.appStore.isConnected) {
        appList = appList.filter(app => app.deviceInfo.transportType !== 'WEBENGINE_WEBSOCKET')
    }

    var data = appList.map ((app) => {
        var icon = ""
        if (app.icon) {
            icon = app.icon.replace("local:", "file:")
        }
        else {
            var appDirEntry = state.appStore.installedApps.find(x => x.policyAppID === app.policyAppID);
            if (appDirEntry) {
                icon = appDirEntry.iconUrl;
            }
        }
        var name = app.isCloudApplication ? app.appName + " (Cloud)" : app.appName;
        var devicename = (app.deviceInfo.name.trim()) ? app.deviceInfo.name 
            : app.deviceInfo.transportType + ": " + app.deviceInfo.id.substring(0, 10) + "...";

        var greyOut = app.greyOut;
        if (app.appID === state.pendingAppLaunch) {
            name = 'Loading...';
            greyOut = true;
        }

        return {
            appID: app.appID,
            class: 'with-image',
            name: name,
            devicename: devicename,
            image: icon,
            link: undefined,
            cmdID: app,
            greyOut: greyOut
        }
    })

    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, app) => {
            let state = store.getState();

            if (state.pendingAppLaunch) {
                return;
            }

            dispatch(setPendingAppLaunch(appID))

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
