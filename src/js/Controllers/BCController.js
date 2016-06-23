import RpcFactory from './RpcFactory'
import store from '../store'
import { updateAppList } from '../actions'

export default class BCController {
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "GetSystemInfo":
                return {"rpc": RpcFactory.BCGetSystemInfoResponse(rpc)}
            case "UpdateAppList":
                store.dispatch(updateAppList(rpc.params.applications))
                return true
        }
    }
}