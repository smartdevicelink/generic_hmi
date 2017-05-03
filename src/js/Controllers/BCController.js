import RpcFactory from './RpcFactory'
import store from '../store'
import { updateAppList, activateApp, deactivateApp, unregisterApplication, policyUpdate } from '../actions'
import sdlController from './SDLController'
var activatingApplication = 0
class BCController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        var incrementedRpcId = 5012
        var rpcAppIdMap = {}
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
                return true
            case "ActivateApp":
                store.dispatch(activateApp(rpc.params.appID))
                return true
            case "OnAppUnregistered":
                store.dispatch(unregisterApplication(rpc.params.appID, rpc.params.unexpectedDisconnect))
                return null
            case "UpdateDeviceList":
                return true
            case "MixingAudioSupported":
                return {"rpc": RpcFactory.MixingAudioResponse(rpc)}
            case "PolicyUpdate":
                store.dispatch(policyUpdate(rpc.params.file, rpc.params.retry, rpc.params.timeout))
                sdlController.getURLS(7)
                return true;
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
    /*onAppActivated(appID) {
        // this.listener.send(RpcFactory.BCOnAppActivatedNotification(appID))
        activatingApplication = appID
        this.listener.send(RpcFactory.SDLActivateApp(appID))
    }*/
    onAppDeactivated(reason, appID) {
        //this.listener.send(RpcFactory.OnAppDeactivatedNotification(reason, appID))
        store.dispatch(deactivateApp(appID))
    }
    onIgnitionCycleOver() {
        this.listener.send(RpcFactory.OnIgnitionCycleOverNotification())
    }
    onExitAllApplications(reason) {
        this.listener.send(RpcFactory.OnExitAllApplicationsNotification(reason))
    }
}

let controller = new BCController()
export default controller