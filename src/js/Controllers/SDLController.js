import RpcFactory from './RpcFactory'
import store from '../store'
import { activateApp, setURLS  } from '../actions'
import bcController from './BCController'
import externalPolicies from './ExternalPoliciesController'
import {flags} from '../Flags'
var activatingApplication = 0
class SDLController {
    constructor () {
        this.addListener = this.addListener.bind(this)

        //ToDo: Add ExternalConsentStatus View
        //Sample struct used below
        /*this.externalConsentStatus = [{
            entityType: 1, entityID: 1, status: "ON"
        }, 
        {
            entityType: 1, entityID: 2, status: "OFF"
        }];*/
        this.externalConsentStatus = [];
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "OnStatusUpdate":
                if(rpc.params.status === "UP_TO_DATE") {
                    if(flags.ExternalPolicies) {
                        externalPolicies.stopUpdateRetry();
                    }                    
                }
                return null;
            default:
                return null
        }
    }
    handleRPCResponse(rpc) {
        let methodName = rpc.result.method.split(".")[1]
        switch (methodName) {
            case "ActivateApp":
                if(rpc.result.isPermissionsConsentNeeded) {
                    this.getListOfPermissions(activatingApplication)
                }
                if(!rpc.result.isSDLAllowed) {
                    //bcController.getUserFriendlyMessages("DataConsent", "AllowSDL", activatingApplication)
                    bcController.onAllowSDLFunctionality(true, "GUI")
                } else {
                    store.dispatch(activateApp(activatingApplication))
                } 
                return;
            case "GetPolicyConfigurationData":
                var urls = JSON.parse(rpc.result.value[0])["0x07"]["default"];
                var parsed_urls = [];
                for (const url of urls) {
                    parsed_urls.push({'url': url});
                }
                store.dispatch(setURLS(parsed_urls))
                var state = store.getState()
                if(flags.ExternalPolicies) {
                    externalPolicies.pack({            
                        type: 'PROPRIETARY',
                        policyUpdateFile: state.system.policyFile,
                        urls: state.system.urls,
                        retry: state.system.policyRetry,
                        timeout: state.system.policyTimeout
                    })
                } else {
                    bcController.onSystemRequest(state.system.policyFile, state.system.urls)
                }
                return;
            case "GetListOfPermissions":         
                //To Do: Implement permission view. For now all permissions are consented
                var allowedFunctions = rpc.result.allowedFunctions
                for (var index in allowedFunctions) {
                    if(!allowedFunctions[index].allowed) {
                        allowedFunctions[index].allowed = true
                    }
                }
                this.onAppPermissionConsent(allowedFunctions, this.externalConsentStatus)
                return;
            default:
                return false;
        }
    }
    onAppActivated(appID) {
        // this.listener.send(RpcFactory.BCOnAppActivatedNotification(appID))
        activatingApplication = appID
        this.listener.send(RpcFactory.SDLActivateApp(appID))
    }
    getPolicyConfiguration(type, property) {
        this.listener.send(RpcFactory.GetPolicyConfigurationData(type, property));
    }
    onReceivedPolicyUpdate(policyFile) {
        this.listener.send(RpcFactory.OnReceivedPolicyUpdate(policyFile))
    }
    getListOfPermissions(appID) {
         this.listener.send(RpcFactory.GetListOfPermissions(appID))
    }
    onAppPermissionConsent(allowedFunctions, externalConsentStatus) {
        this.listener.send(RpcFactory.OnAppPermissionConsent(allowedFunctions, externalConsentStatus))
    }
}

let controller = new SDLController()
export default controller