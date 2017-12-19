import RpcFactory from './RpcFactory'
import store from '../store'
import { initVehicleData } from '../actions'
class VehicleInfoController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        var incrementedRpcId = 5012
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch(methodName) {
            case "IsReady":
            store.dispatch(initVehicleData())
                return {rpc: RpcFactory.IsReadyResponse(rpc, true)}
            case "GetVehicleType":
                return {rpc: RpcFactory.GetVehicleType(rpc)}
            case "SubscribeVehicleData":
                return {rpc: RpcFactory.SubscribeVehicleDataResponse(rpc)}
        }
    }
    onVehicleData(name, value, formType) {
        var params= {};
        var rpc
        switch (name) {
            case "Speed": 
                params = {"speed" : Number(value)}
                break;
            case "RPM":
                params = {"rpm" : Number(value)}
                break;
            case "Fuel Level":
                params = {"fuelLevel" : Number(value)}
                break;
            case "PRNDL":
                params = {"prndl" : value}
                break;
            case "Tire Pressure":
                params = {
                    "tirePressure" : {
                        "leftFront": {
                            "status": value
                        },
                        "rightFront": {
                            "status": value
                        },
                        "leftRear": {
                            "status": value
                        },
                        "rightRear": {
                            "status":   value
                        },
                    }
                }
                break;
            case "Odometer":
                params = {"odometer" : Number(value)}
                break;
            case "Driver Braking":
                params = {"driverBraking" : value}
                break;
            default:
                return;
        }

        console.log("Sending onvehicledata")
        this.listener.send(RpcFactory.OnVehicleData(params))
    }
}

let controller = new VehicleInfoController ()
export default controller