import RpcFactory from './RpcFactory'
import store from '../store'
import { updateAppList, activateApp, unregisterApplication } from '../actions'

class BCController {
    constructor () {
        this.addListener = this.addListener.bind(this)
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
                return true
        }
    }
    onAppActivated(appID) {
        this.listener.send(RpcFactory.BCOnAppActivatedNotification(appID))
    }
    onAppDeactivated(reason, appID) {
        this.listener.send(RpcFactory.OnAppDeactivatedNotification(reason, appID))
    }
}

let controller = new BCController()
export default controller