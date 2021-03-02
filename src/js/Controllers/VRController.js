import RpcFactory from './RpcFactory'
class VRController {
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
                return true
            default: 
                return false
        }
    }
}

let controller = new VRController ()
export default controller