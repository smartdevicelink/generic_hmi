let url = "ws://localhost:8087"
let file_access_base_url = "";
import bcController from './BCController';
import uiController from './UIController';
import vrController from './VRController';
import ttsController from './TTSController';
import viController from './VehicleInfoController';

export default class Controller {
    constructor () {
        this.socket = null
        bcController.addListener(this)
        uiController.addListener(this)
        // this.vrController = new VRController;
        // this.ttsController = new TTSController;
        // this.navController = new NavigationController;
        // this.vehicleInfoController = new VehicleInfoController;
    }
    connectToSDL() {
        navigator.serviceWorker.controller.postMessage({ type: 'connectToWS' });
    }
    addSWListener() {
        navigator.serviceWorker.onmessage = this.onmessage.bind(this);
    }
    disconnectFromSDL() {
        if (this.retry) {
            clearInterval(this.retry);
        }
        if (this.socket) {
            if(this.socket.readyState === this.socket.OPEN) {
                this.socket.onclose = function () {
                    this.socket.close()
                }
            }
        }
    }
    onclose (evt) {
        if (!this.retry) {
            this.retry = setInterval(this.connectToSDL.bind(this), 4000)
        }
    }
    onmessage(evt) {
        // var rpc = JSON.parse(evt.data)
        console.log("incoming rpc", evt.data)
        this.handleRPC(evt.data)
    }
    respondSuccess (method, id) {
        var obj = {
            "jsonrpc": "2.0",
            "id": id,
            "result": {
                "code": 0,
                "method": method
            }
        }
        this.send(obj);
    }
    respondFail (method, id) {
        var obj = {
            "jsonrpc": "2.0",
            "id": id,
            "result": {
                "code": 22,
                "method": method
            }
        }
        this.send(obj)
    }
    send(rpc) {
        console.log("outgoing rpc", rpc)
        var jsonString = JSON.stringify(rpc);
        navigator.serviceWorker.controller.postMessage({ type: 'sendToWS', data: jsonString });
    }
    handleRPC(rpc) {
        var response = undefined
        let componentName = undefined
        rpc = this.sanitizeRPC(rpc)
        if (rpc.method) {
            componentName = rpc.method.split(".")[0];
        } else if (rpc.result.method) {
            // It's a response
            bcController.handleRPCResponse(rpc)
            return
        } else {
            return
        }
        switch (componentName) {
            case "BasicCommunication":
                response = bcController.handleRPC(rpc);
                break;
            case "UI":
            case "Buttons":
                response = uiController.handleRPC(rpc);
                break;
            case "VR":
                response = vrController.handleRPC(rpc);
                break;
            case "TTS":
                response = ttsController.handleRPC(rpc);
                break;
            case "VehicleInfo":
                response = viController.handleRPC(rpc)
                break;
            // case "Navigation":
            //     response = navController.handleRPC(rpc);
            //     break;
        }
        // TODO: going to require one type of response which info is passed to App to determine success/fail
        if (response === null) {
            // don't do anything, it was a notification
        }
        else if (response === undefined) {
            // Just haven't implemented these rpcs see declaration of response
        }
        else if (response === true) {
            this.respondSuccess(rpc.method, rpc.id)
        }
        else if (response === false) {
            this.respondFail(rpc.method, rpc.id)
        }
        // The component attached a response rpc and possibly a new state
        else if (response.rpc) {
            this.send(response.rpc)
        }
        else {
            console.log('got invalid response from controller', response)
        }
    }
    sanitizeRPC(rpc) {
        var sanitized = { ...rpc }
        sanitized.params = this.sanitizeRPCHelper(sanitized.params)
        return sanitized
    }
    sanitizeRPCHelper(obj) {
        for (var prop in obj) {
            if (this.isArray(obj[prop]) || this.isObject(obj[prop])) {
                obj[prop] = this.sanitizeRPCHelper(obj[prop])
            } else {
                switch (prop) {
                    case "icon":
                    case "value":
                        obj[prop] = file_access_base_url + obj[prop]
                        break;
                }
            }
        }
        return obj
    }
    isArray (a) {
        return (!!a) && (a.constructor === Array)
    }
    isObject(a) {
        return (!!a) && (typeof a === 'object' && a !== null)
    }
}
