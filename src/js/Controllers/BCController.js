import RpcFactory from './RpcFactory'
import store from '../store'
import { updateAppList, activateApp, deactivateApp, unregisterApplication, policyUpdate,  updateColorScheme, setAppIsConnected } from '../actions'
import sdlController from './SDLController'
import externalPolicies from './ExternalPoliciesController'
import {flags} from '../Flags'
var activatingApplication = 0
class BCController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        var incrementedRpcId = 5012
        var rpcAppIdMap = {}
        var getUserFriendlyMessageCallback={}
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "GetSystemInfo":
                return {"rpc": RpcFactory.BCGetSystemInfoResponse(rpc)}
            case "UpdateAppList":
                store.dispatch(updateAppList(rpc.params.applications))
                rpc.params.applications.map((app, index) => {
                    if (app.dayColorScheme || app.nightColorScheme) {
                        store.dispatch(updateColorScheme(
                            app.appID,
                            app.dayColorScheme ? app.dayColorScheme : null,
                            app.nightColorScheme ? app.nightColorScheme : null
                        ));
                    }
                });
                return true
            case "ActivateApp":
                store.dispatch(setAppIsConnected(rpc.params.appID))
                store.dispatch(activateApp(rpc.params.appID))
                return true
            case "OnAppUnregistered":
                store.dispatch(unregisterApplication(rpc.params.appID, rpc.params.unexpectedDisconnect))
                store.dispatch(deactivateApp())
                return null
            case "UpdateDeviceList":
                return true
            case "MixingAudioSupported":
                return {"rpc": RpcFactory.MixingAudioResponse(rpc)}
            case "PolicyUpdate":
                store.dispatch(policyUpdate(rpc.params.file, rpc.params.retry, rpc.params.timeout))
                sdlController.getURLS(7)
                return true;
            case "SystemRequest":
                if(flags.ExternalPolicies) {
                    externalPolicies.unpack(rpc.params.fileName)
                } else {
                    sdlController.onReceivedPolicyUpdate(rpc.params.fileName)
                }
 
                return true
        }
    }
    handleRPCResponse(rpc) {
        let methodName = rpc.result.method.split(".")[1]
        /*switch (methodName) {
            case "ActivateApp":
                store.dispatch(activateApp(activatingApplication))
                return;
        }*/
    }
    onAppDeactivated(reason, appID) {
        this.listener.send(RpcFactory.OnAppDeactivatedNotification(reason, appID))
        store.dispatch(deactivateApp(appID))
    }
    onIgnitionCycleOver() {
        this.listener.send(RpcFactory.OnIgnitionCycleOverNotification())
    }
    onExitAllApplications(reason) {
        this.listener.send(RpcFactory.OnExitAllApplicationsNotification(reason))
    }
    onSystemRequest(policyFile, urls) {
        for (var i in urls) {
            var appID = urls[i].appID
            var url = urls[i].url
            this.listener.send(RpcFactory.OnSystemRequestNotification(policyFile, url, appID))
        }
        
    }
    onAllowSDLFunctionality(allowed, source) {
        this.listener.send(RpcFactory.OnAllowSDLFunctionality(allowed, source))
    }
}

let controller = new BCController()
export default controller