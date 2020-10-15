import {capabilities, getDisplayCapability} from './DisplayCapabilities.js'
var rpcFactory_msgId = 5012
class RpcFactory {
    static SetAppProperties(properties) {
        return {
            "jsonrpc": "2.0",
            "id": rpcFactory_msgId++,
            "method": "BasicCommunication.SetAppProperties",
            "params": {
                "properties": properties
            }
        }
    }
    static GetAppProperties(policyAppID) {
        let msg = {
            "jsonrpc": "2.0",
            "id": rpcFactory_msgId++,
            "method": "BasicCommunication.GetAppProperties",
            "params": {}
        }
        if (policyAppID) {
            msg.params.policyAppID = policyAppID
        }
        return msg;
    }
    static UnsupportedResourceResponse(rpc, message) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "error": {
                "code": 2,
                "message": message,
                "data": {
                    "method": rpc.method
                }
            }            
        })
    }
    static InvalidIDResponse(rpc, message) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "error": {
                "code": 13,
                "message": message,
                "data": {
                    "method": rpc.method
                }
            }
        })
    }            
    static SubtleAlertResponse(rpcID) {
        return ({
            "jsonrpc": "2.0",
            "id": rpcID,
            "result": {
                "code": 0,
                "method": "UI.SubtleAlert"
            }
        })
    }
    static SubtleAlertErrorResponse(rpcID, code, info) {
        return ({
            "jsonrpc": "2.0",
            "id": rpcID,
            "error": {
                "code": code,
                "message": info,
                "data": {
                    "method": "UI.SubtleAlert"
                }
            }
        })
    }
    static OnSubtleAlertPressed(appID) {
        return ({
            "jsonrpc": "2.0",
            "method": "UI.OnSubtleAlertPressed",
            "params": {
                "appID": appID
            }
        })
    }
    static AlertResponse(rpcID) {
        return ({
            "jsonrpc": "2.0",
            "id": rpcID,
            "result": {
                "code": 0,
                "method": "UI.Alert"
            }
        })
    }
    static AlertAbortedResponse(rpcID) {
        return ({
            "jsonrpc": "2.0",
            "id": rpcID,
            "error": {
                "code": 5,
                "message": "The Interaction was cancelled",
                "data": {
                    "method": "UI.Alert"
                }
            }
        })
    }
    static UIGetCapabilitiesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "displayCapabilities": capabilities["MEDIA"].displayCapabilities,
                "audioPassThruCapabilities": capabilities["COMMON"].audioPassThruCapabilities,
                "audioPassThruCapabilitiesList": capabilities["COMMON"].audioPassThruCapabilitiesList,
                "pcmStreamCapabilities": capabilities["COMMON"].pcmStreamCapabilities,
                "hmiZoneCapabilities": capabilities["COMMON"].hmiZoneCapabilities,
                "softButtonCapabilities": capabilities["MEDIA"].softButtonCapabilities,
                "hmiCapabilities": capabilities["COMMON"].hmiCapabilities,
                "systemCapabilities": capabilities["COMMON"].systemCapabilities
            }
        })
    }
    static TTSGetCapabilitiesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "speechCapabilities": capabilities["COMMON"].speechCapabilities,
                "prerecordedSpeechCapabilities": capabilities["COMMON"].prerecordedSpeechCapabilities,
            }
        })
    }
    static VRGetCapabilitiesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                'vrCapabilities': ['TEXT']
            }
        })
    }
    static activateAppResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code":0,
                "isAppPermissionsRevoked": false,
                "isAppRevoked": false,
                "isPermissionsConsentNeeded": false,
                "isSDLAllowed": true
            }
        })
    }
    static UIPerformInteractionAbortedResponse(msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "error": {
                "code": 5,
                "message": "The Interaction was cancelled",
                "data": {
                    "method": "UI.PerformInteraction"
                }
            }
        })
    }
    static UIPerformInteractionResponse(choiceID, appID, msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "result": {
                "method": "UI.PerformInteraction",
                "code": 0,
                "choiceID": choiceID
            }
        })
    }
    static VRPerformInteractionResponse(choiceID, appID, msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "result": {
                "method": "VR.PerformInteraction",
                "code": 0,
                "choiceID": choiceID
            }
        })
    }
    static ButtonsGetCapabilitiesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "capabilities": capabilities["MEDIA"].buttonCapabilities,
                "presetBankCapabilities": {
                    "onScreenPresetsAvailable": false
                }
            }
        })
    }
    static GetSupportedLanguagesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "languages": ["EN-US"]
            }
        })        
    }
    static GetLanguageResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "language": "EN-US"
            }
        })
    }
    static IsReadyResponse(rpc, ready) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "available": ready,
                "code": 0,
                "method": rpc.method
            }
        })
    }
    static BCGetSystemInfoResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "ccpu_version": "0.0.1",
                "language": "EN-US",
                "wersCountryCode": "WAEGB",
            }
        })
    }
    static BCOnAppActivatedNotification(appID) {
        return ({
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnAppActivated",
            "params": {
                "appID": appID
            }
        })
    }
    static SDLActivateApp(appID) {
        return ({
            "jsonrpc": "2.0",
            "id": rpcFactory_msgId++,
            "method": "SDL.ActivateApp",
            "params": {
                "appID": appID
            }
        })
    }
    static BCOnAppDeactivatedNotification(appID) {
        return ({
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnAppDeactivated",
            "params": {
                "appID": appID,
                "reason": "GENERAL"
            }
        })
    }
    static OnCommandNotification(cmdID, appID) {
        return ({
            "jsonrpc": "2.0",
            "method": "UI.OnCommand",
            "params": {
                "appID": appID,
                "cmdID": cmdID
            }
        })
    }
    static OnSystemContextNotification(context, appID) {
        return ({
            "jsonrpc": "2.0",
            "method": "UI.OnSystemContext",
            "params": {
                "appID": appID,
                "systemContext": context
            }
        })
    }
    static GetVehicleType(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "code": 0,
                "method": "VehicleInfo.GetVehicleType",
                "vehicleType": {
                    "make": "SDL",
                    "model": "Generic",
                    "modelYear": "2019",
                    "trim": "SE"
                }
            }
        })
    }
    static UIPerformInteractionFailure (msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "error": {
                "code": 5,
                "message": "UI.PerformInteraction Aborted",
                "data": {
                    "method": "UI.PerformInteraction"
                }
            }
        })
    }
    static UIPerformInteractionTimeout (msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "error": {
                "code": 10,
                "message": "UI.PerformInteraction Timed Out",
                "data": {
                    "method": "UI.PerformInteraction"
                }
            }
        })
    }
    static VRPerformInteractionFailure (msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "error": {
                "code": 22,
                "message": "VR.PerformInteraction Failed",
                "data": {
                    "method": "VR.PerformInteraction"
                }
            }
        })
    }
    static OnAppDeactivatedNotification(reason, appID) {
        return ({
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnAppDeactivated",
            "params": {
                "appID": appID,
                "reason": reason
            }
        })
    }
    static OnButtonPressNotification(appID, button) {
        return ({
            "jsonrpc": "2.0",
            "method": "Buttons.OnButtonPress",
            "params": {
                "name": button.name,
                "mode": button.mode,
                "appID": appID,
                "customButtonID": button.customButtonID
            }
        })
    }
    static OnButtonEventNotification(appID, button) {
        return ({
            "jsonrpc": "2.0",
            "method": "Buttons.OnButtonEvent",
            "params": {
                "name": button.name,
                "mode": button.mode,
                "appID": appID,
                "customButtonID": button.customButtonID
            }
        })
    }
    static MixingAudioResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": "BasicCommunication.MixingAudioSupported",
                "code": 0,
                "attenuatedSupported": true
            }
        })
    }
    static GetVehicleDataResponse(rpc, data) {
        var obj = {
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "code": 0,
                "method": rpc.method
            }
        }
        for (var key in data) {
            obj.result[key] = data[key]
        }
        return (obj)
    }
    static GetVehicleTypeResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "code": 0,
                "method": rpc.method,
                "vehicleType": {
                    "make": "SDL",
                    "model": "Generic",
                    "modelYear": "2019",
                    "trim": "SE"
                }
            }
        })
    }
    static OnIgnitionCycleOverNotification(){
        return ({
            'jsonrpc': '2.0',
            'method': 'BasicCommunication.OnIgnitionCycleOver'
        })
    }
    static OnExitApplicationNotification(reason, appID){
        return ({
            'jsonrpc': '2.0',
            'method': 'BasicCommunication.OnExitApplication',
            'params': {
                'reason': reason,
                'appID': appID
            }
        })
    }
    static OnExitAllApplicationsNotification(reason){
        return ({
            'jsonrpc': '2.0',
            'method': 'BasicCommunication.OnExitAllApplications',
            'params': {
                'reason': reason
            }
        })
    }
    static OnResetTimeout(appID, methodName) {
        return ({
            'jsonrpc': '2.0',
            'method': 'BasicCommunication.OnResetTimeout',
            'params': {
                'appID': appID,
                'methodName': methodName
            }           
        })
    }
    static GetPolicyConfigurationData(type, property) {
        return ({
           'jsonrpc': '2.0',
           "id": rpcFactory_msgId++,
           'method': 'SDL.GetPolicyConfigurationData',
           'params': {
               'policyType' : type,
               'property' : property
           }           
       })       
   }
    static OnSystemRequestNotification(policyFile, url, appID) {
        var msg = {
            'jsonrpc': '2.0',
            'method': 'BasicCommunication.OnSystemRequest',
            'params': {
                'requestType': 'PROPRIETARY',
                'fileName': policyFile
            }
        }
        if (url) {
            msg.params.url = url
        }
        if (appID) {
            msg.params.appID = appID
        }
        return (msg)       
    }
    static OnReceivedPolicyUpdate(policyFile) {
        return ({
            'jsonrpc': '2.0',
            'method': 'SDL.OnReceivedPolicyUpdate',
            'params': {
                'policyfile': policyFile
            }
        })          
    }
    static OnAllowSDLFunctionality(allowed, source) {
        return({
            'jsonrpc': '2.0',
            'method': 'SDL.OnAllowSDLFunctionality',
            'params': {
                'allowed': allowed,
                'source': source
            }           
        })
    }
    static GetListOfPermissions(appID) {
        var msg = {
            'jsonrpc': '2.0',
            'id': rpcFactory_msgId++,
            'method': 'SDL.GetListOfPermissions',
            'params': {}           
        }
        if(appID) {
            msg.params.appID = appID
        }
        return (msg)         
    }
    static OnAppPermissionConsent(appID, consentedFunctions, externalConsentStatus) {
        var msg = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnAppPermissionConsent',
          'params': {
            'source': 'GUI'
          }
        }
        if(appID) {
            msg.params.appID = appID
        }
        if(consentedFunctions) {
            msg.params.consentedFunctions = consentedFunctions
        }
        if(externalConsentStatus) {
            msg.params.externalConsentStatus = externalConsentStatus
        }
        return (msg)
    }

    static GetSystemTime(id) {
        var date = new Date();
        var systemTime = {
            millisecond: date.getMilliseconds(),
            second: date.getSeconds(),
            minute: date.getMinutes(),
            hour: date.getHours(),
            day: date.getDate(),
            month: date.getMonth()+1,
            year: date.getFullYear(),
            tz_hour: Math.floor(date.getTimezoneOffset()/-60),
            tz_minute: Math.abs(date.getTimezoneOffset()%60)
        }
        var msg = {
            'jsonrpc': '2.0',
            'id': id,
            'result': {
                'code': 0, // type (enum) from SDL protocol
                'method': 'BasicCommunication.GetSystemTime',
                'systemTime': systemTime
            }
        }
        return msg  
    }
    static SetDisplayLayoutResponse(rpc) {
        var layout = rpc.params.displayLayout;
        var supportedTemplates = ["DEFAULT", "MEDIA", "NON-MEDIA", "LARGE_GRAPHIC_ONLY", 
        "LARGE_GRAPHIC_WITH_SOFTBUTTONS", "GRAPHIC_WITH_TEXTBUTTONS", "TEXTBUTTONS_WITH_GRAPHIC", 
        "TEXTBUTTONS_ONLY", "TILES_ONLY", "TEXT_WITH_GRAPHIC", "GRAPHIC_WITH_TEXT", "DOUBLE_GRAPHIC_WITH_SOFTBUTTONS"];
        if (supportedTemplates.includes(layout)) {
            if (layout === "DEFAULT") {
                layout = "MEDIA"
            }
            var response = {
                "jsonrpc": "2.0",
                "id": rpc.id,
                "result": {
                    "method": rpc.method,
                    "code": 0
                }
            }
            if (capabilities[layout].displayCapabilities) {
                response.result["displayCapabilities"] = capabilities[layout].displayCapabilities
            }
            if (capabilities[layout].softButtonCapabilities) {
                response.result["softButtonCapabilities"] = capabilities[layout].softButtonCapabilities
            }
            if (capabilities[layout].buttonCapabilities) {
                response.result["buttonCapabilities"] = capabilities[layout].buttonCapabilities
            }
            return (response)        
        } else {
            return ({
                "jsonrpc": "2.0",
                "id": rpc.id,
                "error": {
                    "code": 1,
                    "message": "The requested layout is not supported on this HMI",
                    "data": {
                        "method": rpc.method
                    }
                }
            })            
        }

    }
    static UICancelInteractionIgnoredResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "error": {
                "code": 6,
                "message": "Request is ignored, because the intended result is already in effect.",
                "data": {
                    "method": "UI.CancelInteraction"
                }
            }
        })
    }
    static OnSystemCapabilityDisplay(template, appID) {
        var systemCapability = {
            systemCapabilityType: "DISPLAYS",
            displayCapabilities: [getDisplayCapability(template)]
        }
        return ({
            "jsonrpc": "2.0",
            "method": "BasicCommunication.OnSystemCapabilityUpdated",
            "params": {
                "systemCapability": systemCapability,
                "appID": appID
            }
        })
    }

    static OnUpdateFile(appID, fileName) {
        return ({
            "jsonrpc": "2.0",
            "method": "UI.OnUpdateFile",
            "params": {
                "appID": appID,
                "fileName": fileName
            }
        })
    }

    static OnUpdateSubMenu(appID, menuID) {
        return ({
            "jsonrpc": "2.0",
            "method": "UI.OnUpdateSubMenu",
            "params": {
                "appID": appID,
                "menuID": menuID,
                "updateSubCells": true
            }
        })
    }
}

export default RpcFactory
