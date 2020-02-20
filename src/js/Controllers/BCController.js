import RpcFactory from './RpcFactory'
import store from '../store'
import { updateAppList, activateApp, deactivateApp, registerApplication, unregisterApplication, policyUpdate, onPutFile,  updateColorScheme, setAppIsConnected, onSystemCapabilityUpdated } from '../actions'
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
                    store.dispatch(setAppIsConnected(app.appID))
                });
                return true
            case "ActivateApp":
                store.dispatch(setAppIsConnected(rpc.params.appID))
                store.dispatch(activateApp(rpc.params.appID))
                return true
            case "CloseApplication":
                store.dispatch(deactivateApp(rpc.params.appID))
                return true
            case "OnAppRegistered":
                store.dispatch(registerApplication(rpc.params.application.appID, rpc.params.application.isMediaApplication));
                if (rpc.params.application.dayColorScheme || rpc.params.application.nightColorScheme) {
                    store.dispatch(updateColorScheme(
                        rpc.params.application.appID,
                        rpc.params.application.dayColorScheme ? rpc.params.application.dayColorScheme : null,
                        rpc.params.application.nightColorScheme ? rpc.params.application.nightColorScheme : null
                    ));
                }
                var template = rpc.params.application.isMediaApplication ? "MEDIA" : "NON-MEDIA";
                this.listener.send(RpcFactory.OnSystemCapabilityDisplay(template, rpc.params.application.appID));
                return null
            case "OnAppUnregistered":
                store.dispatch(deactivateApp(rpc.params.appID))
                store.dispatch(unregisterApplication(rpc.params.appID, rpc.params.unexpectedDisconnect))                
                return null
            case "OnSystemCapabilityUpdated":
                store.dispatch(onSystemCapabilityUpdated(rpc.params.systemCapability))
                return null
            case "OnPutFile":
                store.dispatch(onPutFile(rpc.params.appID, rpc.params.syncFileName, rpc.params.fileType, rpc.params.fileSize, 
                                         rpc.params.offset, rpc.params.length, rpc.params.isSystemFile, rpc.params.isPersistentFile))
                return null
            case "UpdateDeviceList":
                return true
            case "MixingAudioSupported":
                return {"rpc": RpcFactory.MixingAudioResponse(rpc)}
            case "PolicyUpdate":
                store.dispatch(policyUpdate(rpc.params.file, rpc.params.retry, rpc.params.timeout))
                sdlController.getPolicyConfiguration("module_config", "endpoints");
                return true;
            case "SystemRequest":
                if (rpc.params.requestType != "PROPRIETARY") {
                    // Generic HMI can only process PROPRIETARY System Requests
                    return true
                }
                if(flags.ExternalPolicies) {
                    externalPolicies.unpack(rpc.params.fileName)
                } else {
                    sdlController.onReceivedPolicyUpdate(rpc.params.fileName)
                } 
                return true
            case "GetSystemTime":
                this.listener.send(RpcFactory.GetSystemTime(rpc.id))
                return null
        }
    }
    handleRPCResponse(rpc) {
        let methodName = rpc.result.method.split(".")[1]
        switch (methodName) {
            case "SetAppProperties":
                console.log('[!] SetAppProperties response: ', rpc);
                return;
            /*case "ActivateApp":
                store.dispatch(activateApp(activatingApplication))
                return;*/
        }
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
    setAppProperties(properties) {
        this.listener.send(RpcFactory.BCSetAppProperties(properties));
    }
}

let controller = new BCController()
export default controller
