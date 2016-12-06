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
            case "StartStream":
                return true;
        }
    }
}

let controller = new NavController()
export default controller