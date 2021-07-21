import bcController from './BCController';
import uiController from './UIController';
import vrController from './VRController';
import ttsController from './TTSController';
import viController from './VehicleInfoController';
import sdlController from './SDLController';
import appServicesController from './AppServicesController';
import externalPolicyManager from './ExternalPoliciesController';
import navController from './NavController'
import store from '../store';

let file_access_base_url = "";

export default class Controller {
    constructor () {
        this.socket = null
        bcController.addListener(this)
        uiController.addListener(this)
        sdlController.addListener(this)
        ttsController.addListener(this)
        navController.addListener(this)
        appServicesController.addListener(this)
        // this.vrController = new VRController;
        // this.vehicleInfoController = new VehicleInfoController;
    }
    connectToSDL() {
        this.socket = new WebSocket(`ws://${window.flags.CoreHost}:${window.flags.CorePort}`)
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
        if(window.flags.ExternalPolicies) {
            externalPolicyManager.connectPolicyManager(window.flags.ExternalPoliciesPackUrl, window.flags.ExternalPoliciesUnpackUrl)
        }
        this.registerComponents()
    }
    onclose (evt) {
        if (!this.retry) {
            this.retry = setInterval(this.connectToSDL.bind(this), 4000)
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
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "BasicCommunication";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "Buttons";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "VR";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "TTS";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "Navigation";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "VehicleInfo";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));
        JSONMessage.params.componentName = "AppService";
        this.send(JSON.parse(JSON.stringify(JSONMessage)));        
        var ready = {
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnReady"
        }
        this.send(ready);
        // register for all notifications
        this.subscribeToNotification("BasicCommunication.OnAppRegistered")
        this.subscribeToNotification("BasicCommunication.OnAppUnregistered")
        this.subscribeToNotification("BasicCommunication.OnPutFile")
        this.subscribeToNotification("Navigation.OnVideoDataStreaming")
        this.subscribeToNotification("Navigation.OnAudioDataStreaming")
        this.subscribeToNotification("SDL.OnStatusUpdate")
        this.subscribeToNotification("SDL.OnAppPermissionChanged")
        this.subscribeToNotification("BasicCommunication.OnSystemCapabilityUpdated")
        this.subscribeToNotification("AppService.OnAppServiceData")
        this.subscribeToNotification("BasicCommunication.OnAppCapabilityUpdated")

        var onSystemTimeReady = {
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnSystemTimeReady"
        }

        this.send(onSystemTimeReady);

        uiController.onDriverDistraction("DD_OFF");
    }
    handleRPC(rpc) {
        var response = undefined
        let componentName = undefined
        rpc = this.sanitizeRPC(rpc)

        if (rpc.error) {
            if (rpc.error.data && rpc.error.data.method) {
                componentName = rpc.error.data.method.split(".")[0];

                switch (componentName) {
                    case "SDL":
                        sdlController.handleRPCError(rpc);
                        break;
                    default:
                        break;
                }
            }
            
            return;
        }

        if (rpc.method) {
            componentName = rpc.method.split(".")[0];
        } else if (rpc.result.method) {
            // It's a response
            componentName = rpc.result.method.split(".")[0];
            switch (componentName) {
                case "BasicCommunication":
                    bcController.handleRPCResponse(rpc);
                    break;
                case "SDL":
                    sdlController.handleRPCResponse(rpc);
                    break;
                default:
                    break;
            }
            
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
                response = viController.handleRPC(rpc);
                break;
            case "SDL":
                response = sdlController.handleRPC(rpc);
                break;
            case "Navigation":
                response = navController.handleRPC(rpc);
                break;
            case "AppService":
                response = appServicesController.handleRPC(rpc);
                break;
            default: 
                response = null;
                break;
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
                    default:
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