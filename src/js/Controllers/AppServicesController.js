import RpcFactory from './RpcFactory'
import store from '../store'

class AppServicesController {
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
            case "OnAppServiceData":
                console.log("todo on app service data")
                return null
        }
    }
}

let controller = new AppServicesController()
export default controller