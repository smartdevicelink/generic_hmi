import RpcFactory from './RpcFactory'
import store from '../store'
import { onAppServiceData } from '../actions'
class AppServicesController {
    constructor () {
        this.addListener = this.addListener.bind(this)
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        console.log("App Service Handle RPC: " + JSON.stringify(rpc))
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, false)}
            case "OnAppServiceData":
                store.dispatch(onAppServiceData(rpc.params.serviceData))
                return null
        }
    }
}

let controller = new AppServicesController()
export default controller