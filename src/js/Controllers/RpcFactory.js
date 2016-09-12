import capabilities from './DisplayCapabilities.js'
var rpcFactory_msgId = 5012
class RpcFactory {
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
            // "jsonrpc": "2.0",
            // "id": rpc.id,
            // "result": {
            //     "method": rpc.method,
            //     "code": 0,
            //     "displayCapabilities": capabilities.displayCapabilities,
            //     "audioPassThruCapabilities": capabilities.audioPassThruCapabilities,
            //     "hmiZoneCapabilities": capabilities.hmiZoneCapabilities,
            //     "softButtonCapabilities": capabilities.softButtonCapabilities,
            //     "hmiCapabilities": capabilities.hmiCapabilities
            // }
            "jsonrpc":"2.0","id":rpc.id,"result":{"displayCapabilities":{"displayType":"GEN2_8_DMA","textFields":[{"name":"mainField1","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"mainField2","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"mainField3","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"mainField4","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"statusBar","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"mediaClock","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"mediaTrack","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"alertText1","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"alertText2","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"alertText3","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"scrollableMessageBody","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"initialInteractionText","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"navigationText1","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"navigationText2","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"ETA","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"totalDistance","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"navigationText","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"audioPassThruDisplayText1","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"audioPassThruDisplayText2","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"sliderHeader","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"sliderFooter","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"notificationText","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"menuName","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"secondaryText","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"tertiaryText","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"timeToDestination","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"turnText","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"menuTitle","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"locationName","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"locationDescription","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"addressLines","characterSet":"TYPE2SET","width":500,"rows":1},{"name":"phoneNumber","characterSet":"TYPE2SET","width":500,"rows":1}],"imageFields":[{"name":"softButtonImage","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"choiceImage","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"choiceSecondaryImage","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"vrHelpItem","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"turnIcon","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"menuIcon","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"cmdIcon","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"graphic","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"showConstantTBTIcon","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"showConstantTBTNextTurnIcon","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}},{"name":"showConstantTBTNextTurnIcon","imageTypeSupported":["GRAPHIC_BMP","GRAPHIC_JPEG","GRAPHIC_PNG"],"imageResolution":{"resolutionWidth":64,"resolutionHeight":64}}],"mediaClockFormats":["CLOCK1","CLOCK2","CLOCK3","CLOCKTEXT1","CLOCKTEXT2","CLOCKTEXT3","CLOCKTEXT4"],"graphicSupported":true,"imageCapabilities":["DYNAMIC","STATIC"],"templatesAvailable":["TEMPLATE"],"screenParams":{"resolution":{"resolutionWidth":800,"resolutionHeight":480},"touchEventAvailable":{"pressAvailable":true,"multiTouchAvailable":true,"doublePressAvailable":false}},"numCustomPresetsAvailable":10},"audioPassThruCapabilities":{"samplingRate":"44KHZ","bitsPerSample":"8_BIT","audioType":"PCM"},"hmiZoneCapabilities":"FRONT","softButtonCapabilities":[{"shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true,"imageSupported":true}],"hmiCapabilities":{"navigation":true,"phoneCall":true},"code":0,"method":"UI.GetCapabilities"}
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
    static PerformInteractionResponse(choiceID, appID, msgID) {
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
    static ButtonsGetCapabilitiesResponse(rpc) {
        return ({
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                // "capabilities": [
                //     {
                //         "name": "OK",
                //         "shortPressAvailable": true,
                //         "longPressAvailable": false,
                //         "upDownAvailable": false
                //     },
                //     {
                //         "name": "SEEKLEFT",
                //         "shortPressAvailable": true,
                //         "longPressAvailable": false,
                //         "upDownAvailable": false
                //     },
                //     {
                //         "name": "SEEKRIGHT",
                //         "shortPressAvailable": true,
                //         "longPressAvailable": false,
                //         "upDownAvailable": false
                //     }
                // ]
                "capabilities":[{"name":"PRESET_0","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_1","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_2","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_3","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_4","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_5","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_6","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_7","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_8","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"PRESET_9","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"OK","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"SEEKLEFT","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"SEEKRIGHT","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"TUNEUP","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true},{"name":"TUNEDOWN","shortPressAvailable":true,"longPressAvailable":true,"upDownAvailable":true}],"presetBankCapabilities":{"onScreenPresetsAvailable":true}
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
    static PerformInteractionFailure (msgID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "error": {
                "code": 10,
                "message": "Timeout reached",
                "data": {
                    "method": "UI.PerformInteraction"
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
                "customButtonID": button.softButtonID
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
                "customButtonID": button.softButtonID
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

}

export default RpcFactory