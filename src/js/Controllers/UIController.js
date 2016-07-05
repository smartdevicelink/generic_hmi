import RpcFactory from './RpcFactory'
import { show, setAppIcon, addCommand } from '../actions'
import store from '../store'

class UIController {
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
                return {"rpc": RpcFactory.IsReadyResponse(rpc, true)}
            case "Show":
                store.dispatch(show(
                    rpc.params.appID,
                    rpc.params.showStrings,
                    rpc.params.graphic,
                    rpc.params.softButtons
                ))
                return true
            case "SetAppIcon":
                store.dispatch(setAppIcon(rpc.params.appID, rpc.params.syncFileName))
                return true
            case "ChangeRegistration":
                return true
            case "AddCommand":
                store.dispatch(addCommand(
                    rpc.params.appID,
                    rpc.params.cmdID,
                    rpc.params.menuParams,
                    rpc.params.cmdIcon
                ))
                return true
        }
    }
}

let controller = new UIController ()
export default controller