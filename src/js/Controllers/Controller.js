let url = "ws://localhost:8087"
import bcController from './BCController';
import uiController from './UIController';
import vrController from './VRController';

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
        this.socket = new WebSocket(url)
        this.socket.onopen = this.onopen.bind(this)
        this.socket.onclose = this.onclose.bind(this)
        this.socket.onmessage = this.onmessage.bind(this)
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
    onopen (evt) {
        if (this.retry) {
            clearInterval(this.retry)
        }
        this.registerComponents()
    }
    onclose (evt) {
        if (!this.retry) {
            this.retry = setInterval(this.connectToSDL(this.listener), 4000)
        }
    }
    onmessage(evt) {
        var rpc = JSON.parse(evt.data)
        console.log("incoming rpc", rpc)
        this.handleRPC(rpc)
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
        this.send(obj)
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
    subscribeToNotification (notification) {
        var obj = {
            "jsonrpc": "2.0",
            "id": -1,
            "method": "MB.subscribeTo",
            "params": {
                "propertyName": notification
            }
        }
        this.send(obj)
    }
    send(rpc) {
        console.log("outgoing rpc", rpc)
        var jsonString = JSON.stringify(rpc);
        this.socket.send(jsonString);
    }
    registerComponents() {
        var JSONMessage = {
            "jsonrpc": "2.0",
            "id": -1,
            "method": "MB.registerComponent",
            "params": {
                "componentName": "UI"
            }
        };
        this.send(JSONMessage);
        JSONMessage.params.componentName = "BasicCommunication";
        this.send(JSONMessage);
        JSONMessage.params.componentName = "Buttons";
        this.send(JSONMessage);
        JSONMessage.params.componentName = "VR";
        this.send(JSONMessage);
        JSONMessage.params.componentName = "TTS";
        this.send(JSONMessage);
        JSONMessage.params.componentName = "Navigation";
        this.send(JSONMessage);
        JSONMessage.params.componentName = "VehicleInfo";
        this.send(JSONMessage);
        var ready = {
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnReady"
        }
        this.send(ready);
        // register for all notifications
        this.subscribeToNotification("Buttons.OnButtonSubscription")
        this.subscribeToNotification("BasicCommunication.OnAppRegistered")
        this.subscribeToNotification("BasicCommunication.OnAppUnregistered")
        this.subscribeToNotification("Navigation.OnVideoDataStreaming")
    }
    handleRPC(rpc) {
        var response = undefined
        let componentName = undefined
        if (rpc.method) {
            componentName = rpc.method.split(".")[0];
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
            // case "TTS":
            //     response = ttsController.handleRPC(rpc);
            //     break;
            // case "Navigation":
            //     response = navController.handleRPC(rpc);
            //     break;
            // case "VehicleInfo":
            //     response = vehicleInfoController.handleRPC(rpc);
            //     break;
        }
        // TODO: going to require one type of response which info is passed to App to determine success/fail
        if (response === undefined) {
            // TODO: should we respond fail for undefined responses?
            // this.respondFail(rpc.method, rpc.id)
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
}