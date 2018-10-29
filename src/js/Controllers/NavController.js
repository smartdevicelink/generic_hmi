import RpcFactory from './RpcFactory'

class NavController {
    constructor () {
        this.addListener = this.addListener.bind(this)
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, false)}
            case "StartStream":
                var message = "This system does not support video streaming."
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, message)};
            case "StartAudioStream":
                var message = "This system does not support audio streaming."
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, message)};
            case "SetVideoConfig":
                var message = "This system does not support video streaming."
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, message)};
            default:
                var message = "This RPC is not supported."
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, message)};
        }
    }
}

let controller = new NavController()
export default controller