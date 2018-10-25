import capabilities from './DisplayCapabilities.js'
var rpcFactory_msgId = 5012
class RpcFactory {
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
    static UIGetCapabilitiesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "displayCapabilities": capabilities["MEDIA"].displayCapabilities,
                "audioPassThruCapabilities": capabilities["COMMON"].audioPassThruCapabilities,
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
                "capabilities": capabilities["MEDIA"].buttonCapabilities
            }
        })
    }
    static UIGetSupportedLanguagesResponse(rpc) {
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
    static UIGetLanguageResponse(rpc, language) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "language": language
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
                    "make": "Ford",
                    "model": "Fiesta",
                    "modelYear": "2013",
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
                "code": 22,
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
                    "make": "ford",
                    "model": "fiesta",
                    "modelYear": "2013",
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
    static GetURLS(serviceType) {
         return ({
            'jsonrpc': '2.0',
            "id": rpcFactory_msgId++,
            'method': 'SDL.GetURLS',
            'params': {
                'service' : serviceType
            }           
        })       
    }
    static OnSystemRequestNotification(policyFile, url, appID) {
        return ({
            'jsonrpc': '2.0',
            'method': 'BasicCommunication.OnSystemRequest',
            'params': {
                'requestType': 'PROPRIETARY',
                'url': url,
                'fileName': policyFile,
                'appID': appID
            }
        })        
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
    static OnAppPermissionConsent(consentedFunctions, externalConsentStatus) {
        var msg = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnAppPermissionConsent',
          'params': {
            'source': 'GUI'
          }
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
            if (layout == "DEFAULT") {
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
                    "data": {
                        "method": rpc.method
                    }
                }
            })            
        }

    }
}

export default RpcFactory