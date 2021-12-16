import { connect } from 'react-redux'
import store from '../store'
import HScrollMenu from '../HScrollMenu'
import { webEngineAppLaunch, webEngineAppLaunchFailed, setPendingAppLaunch, clearPendingAppLaunch, alert } from '../actions'
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
            
            var attempts = 0;
            var activateAppOnceRegistered = setInterval(() => {
                if (attempts > 120) {
                    store.dispatch(clearPendingAppLaunch());
                    store.dispatch(webEngineAppLaunchFailed(appID));
                    store.dispatch(alert(appID,
                        [
                            {fieldName: "alertText1", fieldText: "Unable to register app"}
                        ],
                        null,
                        [
                            {type: "TEXT", text: "Dismiss", systemAction: "DEFAULT_ACTION", softButtonID: 1000}
                        ],
                        "BOTH")
                    )
                    clearInterval(activateAppOnceRegistered);
                    return;
                }
                else if (!app.isRegistered) {
                    attempts++;
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
