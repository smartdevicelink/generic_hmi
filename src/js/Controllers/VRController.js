import RpcFactory from './RpcFactory'
class VRController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.startVR = this.startVR.bind(this)
        this.stopVR = this.stopVR.bind(this)
    }

    addListener(listener) {
        this.listener = listener
    }

    startVR() {
        this.listener.send(RpcFactory.PluginVRStartedMessage())
    }

    stopVR() {
        this.listener.send(RpcFactory.PluginVRStoppedMessage())
    }

    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch(methodName) {
            case "IsReady":
                return {rpc: RpcFactory.IsReadyResponse(rpc, true)}
            case "GetCapabilities":
                return {rpc: RpcFactory.VRGetCapabilitiesResponse(rpc)}
            case "GetSupportedLanguages":
                return { rpc: RpcFactory.GetSupportedLanguagesResponse(rpc) }
            case "GetLanguage":
                return { rpc: RpcFactory.GetLanguageResponse(rpc) }
            case "ChangeRegistration":
                return true
            case "AddCommand":
                return true
            case "DeleteCommand":
                return true
            case "PerformInteraction":
                return { rpc: RpcFactory.ErrorResponse(rpc, 5, "VR.PerformInteraction is not implemented") }
            default: 
                return false
        }
    }
}

let controller = new VRController ()
export default controller