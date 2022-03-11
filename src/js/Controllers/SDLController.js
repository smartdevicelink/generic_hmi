import React from 'react';
import RpcFactory from './RpcFactory'
import store from '../store'
import { activateApp, setURLS, setPTUWithModem, clearPendingAppLaunch, openPermissionsView, onStatusUpdate } from '../actions'
import bcController from './BCController'
import externalPolicies from './ExternalPoliciesController'
import FileSystemController from './FileSystemController'
import { PermissionsPopup } from '../PermissionsPopups';
import ttsController from './TTSController';

import FillConsumerFriendlyMessages, { GatherLabels } from '../Utils/FillConsumerFriendlyMessages';

import toast from 'react-hot-toast';

var activatingApplication = 0
var permissionsPendingApps = {}
class SDLController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.handleRPCError = this.handleRPCError.bind(this)
                
        //ToDo: Add ExternalConsentStatus View
        //Sample struct used below
        /*this.externalConsentStatus = [{
            entityType: 1, entityID: 1, status: "ON"
        }, 
        {
            entityType: 1, entityID: 2, status: "OFF"
        }];*/
        this.externalConsentStatus = null;
        store.dispatch(setPTUWithModem(window.flags.PTUWithModemEnabled));

        this.gufmCallbacks = {};
        this.getUserFriendlyMessage = this.getUserFriendlyMessage.bind(this);

        this.cfmToUpdateResult = {
            StatusNeeded: 'UPDATE_NEEDED',
            StatusPending: 'UPDATING',
            StatusUpToDate: 'UP_TO_DATE'
        }
        this.statusMessages = {};
        this.toastStatus = this.toastStatus.bind(this);
    }
    addListener(listener) {
        this.listener = listener
    }
    toastStatus(status) {
        if (!this.statusMessages[status]) {
            this.getUserFriendlyMessage([ "StatusNeeded", "StatusPending", "StatusUpToDate" ], (response) => {
                if (response.result.messages) {
                    for (var msg of response.result.messages) {
                        this.statusMessages[this.cfmToUpdateResult[msg.messageCode]] = msg;
                    }
                } else {
                    this.statusMessages['UPDATE_NEEDED'] = 'Update Needed';
                    this.statusMessages['UPDATING'] = 'Updating';
                    this.statusMessages['UP_TO_DATE'] = 'Update Complete';
                }
                

                this.toastStatus(status);
            });
        } else {
            if (this.statusMessages[status].ttsString) { ttsController.queueTTS(this.statusMessages[status].ttsString); }
            if (window.flags.StatusUpdateIcon) {
                store.dispatch(onStatusUpdate(status, this.statusMessages[status].line1));
            } else {
                toast((_toast) => (<PermissionsPopup _toast={_toast} header={this.statusMessages[status].line1}/>), { duration: 2000 });
            }
        }
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "OnStatusUpdate":
                if(rpc.params.status === "UP_TO_DATE") {
                    if(window.flags.ExternalPolicies) {
                        externalPolicies.stopUpdateRetry();
                    }                    
                }
                this.toastStatus(rpc.params.status);
                return null;
            case "OnAppPermissionChanged":
                if (rpc.params.appPermissionsConsentNeeded) {
                    this.getListOfPermissions(rpc.params.appID);
                }

                if (rpc.params.appRevoked) {
                    this.getUserFriendlyMessage([ "AppUnsupported" ], (response) => {
                        var revokedApp = store.getState().appList.find((app) => {
                            return app.appID === rpc.params.appID;
                        });
                        var heading = 'App was revoked';
                        var body = `app ${revokedApp.appName} has been revoked`;
                        if (response.result.messages && response.result.messages.length === 1) {
                            var msg = FillConsumerFriendlyMessages(revokedApp.appName, response.result.messages)[0];
                            if (msg.line1 || msg.line2) { heading = [msg.line1,msg.line2].join(' '); }
                            if (msg.textBody) { body = msg.textBody; }
                            if (msg.ttsString) { ttsController.queueTTS(msg.ttsString); }
                        }
                        toast((_toast) => (<PermissionsPopup _toast={_toast} header={heading} body={body}/>), { duration: 5000 });
                    });
                } else if (rpc.params.appUnauthorized) {
                    this.getUserFriendlyMessage([ "AppUnauthorized" ], (response) => {
                        var unauthorizedApp = store.getState().appList.find((app) => {
                            return app.appID === rpc.params.appID;
                        });
                        var heading = 'App is not authorized';
                        var body = `app ${unauthorizedApp.appName} is not authorized to run on this head unit`;
                        if (response.result.messages && response.result.messages.length === 1) {
                            var msg = FillConsumerFriendlyMessages(unauthorizedApp.appName, response.result.messages)[0];
                            if (msg.line1 || msg.line2) { heading = [msg.line1,msg.line2].join(' '); }
                            if (msg.textBody) { body = msg.textBody; }
                            if (msg.ttsString) { ttsController.queueTTS(msg.ttsString); }
                        }
                        toast((_toast) => (<PermissionsPopup _toast={_toast} header={heading} body={body}/>), { duration: 5000 });
                    });
                }

                if (rpc.params.isAppPermissionsRevoked && rpc.params.appRevokedPermissions?.length) {
                    var messageCodes = rpc.params.appRevokedPermissions.map(x => x.name);
                    messageCodes.push('AppPermissionsRevoked');
                    this.getUserFriendlyMessage(messageCodes, (response) => {
                        var revokedApp = store.getState().appList.find((app) => {
                            return app.appID === rpc.params.appID;
                        });
                        var labels = '';
                        if (response.result.messages) {
                            labels = GatherLabels(response.result.messages);
                            for (var msg of response.result.messages) {
                                if (msg.messageCode === 'AppPermissionsRevoked') {
                                    ttsController.queueTTS(FillConsumerFriendlyMessages(revokedApp.appName, [msg], labels)[0].ttsString);
                                    break;
                                }
                            }
                        } else {
                            labels = messageCodes.map(code => code.name).join(', ');
                        }
                        toast((_toast) => (<PermissionsPopup _toast={_toast} header='App Permissions Revoked' body={labels}/>), { duration: 5000 });
                    });
                }
                return null;
            default:
                return null
        }
    }
    handleRPCResponse(rpc) {
        let methodName = rpc.result.method.split(".")[1]
        var that = this;
        switch (methodName) {
            case "ActivateApp":
                store.dispatch(clearPendingAppLaunch());
                if (!rpc.result.isSDLAllowed) {
                    this.getUserFriendlyMessage([ "DataConsent" ], (response) => {
                        var header = "Allow SDL?";
                        var body = "FAILED to GetUserFriendlyMessage DataConsent, allow SDL functionality?";
                        if (response.result.messages && response.result.messages.length === 1) {
                            var msg = response.result.messages[0];
                            if (msg.line1 || msg.line2) { header = [msg.line1,msg.line2].join(' '); }
                            if (msg.textBody) { body = msg.textBody; }
                            if (msg.ttsString) { ttsController.queueTTS(msg.ttsString); }
                        }
                        toast((_toast) => (
                            <PermissionsPopup header={header} body={body} buttons={[
                                {
                                    label: 'ALLOW',
                                    onClick: () => { 
                                        toast.dismiss(_toast.id);
                                        bcController.onAllowSDLFunctionality(true, 'GUI');
                                        if (rpc.result.isPermissionsConsentNeeded) {
                                            this.getListOfPermissions(activatingApplication, true);
                                        }
                                    } 
                                },
                                {
                                    label: 'HELP',
                                    onClick: () => {
                                        that.getUserFriendlyMessage([ "DataConsentHelp" ], (helpResponse) => {
                                            var header2 = "Allow SDL Help";
                                            var body2 = "FAILED to GetUserFriendlyMessage DataConsentHelp, click OK";
                                            if (helpResponse.result.messages && helpResponse.result.messages.length === 1) {
                                                var msg = helpResponse.result.messages[0];
                                                if (msg.line1 || msg.line2) { header2 = [msg.line1,msg.line2].join(' '); }
                                                if (msg.textBody) { body2 = msg.textBody; }
                                                if (msg.ttsString) { ttsController.queueTTS(msg.ttsString); }
                                            }
                                            toast((_toast) => (<PermissionsPopup _toast={_toast} header={header2} body={body2}/>));
                                        });
                                    }
                                },
                                {
                                    label: 'CANCEL',
                                    onClick: () => {
                                        toast.dismiss(_toast.id);
                                    }
                                }
                            ]}/>
                        ), { duration: 30000 });
                    });
                } else if (rpc.result.isAppRevoked) {
                    var revokedApp = store.getState().appList.find((app) => {
                        return app.appID === activatingApplication;
                    });
                    var revokedAppName = revokedApp ? revokedApp.appName : 'App';
                    this.getUserFriendlyMessage([ "AppUnauthorized" ], (response) => {
                        var heading = 'App is revoked';
                        var body = `${revokedAppName} does not have permission to run`;
                        if (response.result.messages && response.result.messages.length === 1) {
                            var msg = FillConsumerFriendlyMessages(revokedApp.appName, response.result.messages)[0];
                            if (msg.line1 || msg.line2) { heading = [msg.line1,msg.line2].join(' '); }
                            if (msg.textBody) { body = msg.textBody; }
                            if (msg.ttsString) { ttsController.queueTTS(msg.ttsString); }
                        }
                        toast((_toast) => (<PermissionsPopup _toast={_toast} header={heading} body={body}/>), { duration: 5000 });
                    });
                } else if (rpc.result.isPermissionsConsentNeeded) {
                    this.getListOfPermissions(activatingApplication);
                } else {
                    store.dispatch(activateApp(activatingApplication))
                } 
                this.listener.send(RpcFactory.NonSdlUpdateActiveApp(true, activatingApplication));
                return;
            case "GetPolicyConfigurationData":
                var urls = JSON.parse(rpc.result.value[0])["0x07"]["default"];
                var parsed_urls = [];
                for (const url of urls) {
                    parsed_urls.push({'url': url});
                }
                store.dispatch(setURLS(parsed_urls))
                var state = store.getState()
                
                let regular_ptu_flow = () => {
                    if(window.flags.ExternalPolicies) {
                        externalPolicies.pack({            
                            requestType: 'PROPRIETARY',
                            fileName: state.system.policyFile,
                            urls: state.system.urls,
                            retry: state.system.policyRetry,
                            timeout: state.system.policyTimeout
                        })
                    }
                    else {
                        bcController.onSystemRequest(state.system.policyFile)
                    }
                };
                
                if(state.system.ptuWithModemEnabled){
                    console.log('PTU: Starting PTU over vehicle modem');
                    let switch_to_regular_ptu_flow = () => {
                        console.log('PTU: PTU over vehicle modem failed. Switching to PTU over mobile')
                        store.dispatch(setPTUWithModem(false))
                        regular_ptu_flow()
                    };

                    if(FileSystemController.isConnected()){
                        FileSystemController.requestPTUFromEndpoint(state.system.policyFile, state.system.urls[0]['url']).then((policyFile) => {
                            that.onReceivedPolicyUpdate(policyFile);
                        }, switch_to_regular_ptu_flow);
                    }
                    else{
                        switch_to_regular_ptu_flow()
                    }
                }
                else{
                    console.log('PTU: Starting PTU over mobile')
                    regular_ptu_flow()
                }
                return;
            case "GetListOfPermissions":
                var { appID, pendingActivation } = permissionsPendingApps[rpc.id];
                var allowedFunctions = rpc.result.allowedFunctions;
                if (allowedFunctions && allowedFunctions.length) {
                    this.getUserFriendlyMessage(allowedFunctions.map(f => f.name), (response) => {
                        for (var f of allowedFunctions) {
                            if (!response.result.messages || response.result.messages.length === 0) {
                                f.title = f.name;
                            } else {
                                for (var msg of response.result.messages) {
                                    if (f.name === msg.messageCode) {
                                        f.title = msg.label;
                                        f.body = msg.textBody;
                                        break;
                                    }
                                }
                            }
                        }

                        store.dispatch(openPermissionsView(appID, allowedFunctions, pendingActivation));
                    });
                } else {
                    store.dispatch(openPermissionsView(appID, []));
                }
                delete permissionsPendingApps[rpc.id];
                return;
            case "GetUserFriendlyMessage":
                if (this.gufmCallbacks[rpc.id]) {
                    this.gufmCallbacks[rpc.id](rpc);
                    delete this.gufmCallbacks[rpc.id];
                } else {
                    console.warn('Received GUFM response with no callback', rpc);
                }
                return;
        }
    }
    handleRPCError(rpc) {
        let methodName = rpc.error.data.method.split(".")[1]
        switch (methodName) {
            case "ActivateApp":
                store.dispatch(clearPendingAppLaunch())
                return;
            default:
                return;
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
    getListOfPermissions(appID, pendingActivation=false) {
        var request = RpcFactory.GetListOfPermissions(appID);
        permissionsPendingApps[request.id] = { appID: appID, pendingActivation: pendingActivation };
        this.listener.send(request)
    }
    onAppPermissionConsent(allowedFunctions, externalConsentStatus) {
        this.listener.send(RpcFactory.OnAppPermissionConsent(allowedFunctions, externalConsentStatus))
    }
    getUserFriendlyMessage(codes, callback) {
        var gufm = RpcFactory.SDLGetUserFriendlyMessage(codes);
        this.gufmCallbacks[gufm.id] = (response) => {
            callback(response);
        }
        this.listener.send(gufm);
    }
    updateSDL() {
        this.listener.send(RpcFactory.UpdateSDL());
    }
}

let controller = new SDLController()
export default controller
