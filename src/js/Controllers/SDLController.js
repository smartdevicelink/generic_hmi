import RpcFactory from './RpcFactory'
import store from '../store'
import { activateApp, getURLS  } from '../actions'
import bcController from './BCController'
var activatingApplication = 0
class SDLController {
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
            default:
                return null
        }
    }
    handleRPCResponse(rpc) {
        let methodName = rpc.result.method.split(".")[1]
        switch (methodName) {
            case "ActivateApp":
                store.dispatch(activateApp(activatingApplication))
                return;
            case "GetURLS":
                store.dispatch(getURLS(rpc.result.urls))
                const state = store.getState() 
                bcController.onSystemRequest(state.system.policyFile, state.system.urls)
                return;
        }
    }
    onAppActivated(appID) {
        // this.listener.send(RpcFactory.BCOnAppActivatedNotification(appID))
        activatingApplication = appID
        this.listener.send(RpcFactory.SDLActivateApp(appID))
    }
    getURLS(serviceType) {
        this.listener.send(RpcFactory.GetURLS(serviceType))
    }
    onReceivedPolicyUpdate(policyFile) {
        this.listener.send(RpcFactory.OnReceivedPolicyUpdate(policyFile))
    }
}

let controller = new SDLController()
export default controller