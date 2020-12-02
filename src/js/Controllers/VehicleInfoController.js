import RpcFactory from './RpcFactory'
class VehicleInfoController {
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch(methodName) {
            case "IsReady":
                return {rpc: RpcFactory.IsReadyResponse(rpc, true)}
            case "GetVehicleType":
                return {rpc: RpcFactory.GetVehicleType(rpc)}
        }
    }
}

let controller = new VehicleInfoController ()
export default controller