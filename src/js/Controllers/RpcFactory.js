import capabilities from './DisplayCapabilities.js'
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
            "jsonrpc": "2.0",
            "id": rpc.id,
            "result": {
                "method": rpc.method,
                "code": 0,
                "displayCapabilities": capabilities.displayCapabilities,
                "audioPassThruCapabilities": capabilities.audioPassThruCapabilities,
                "hmiZoneCapabilities": capabilities.hmiZoneCapabilities,
                "softButtonCapabilities": capabilities.softButtonCapabilities,
                "hmiCapabilities": capabilities.hmiCapabilities
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
                "capabilities": [
                    {
                        "name": "OK",
                        "shortPressAvailable": true,
                        "longPressAvailable": false,
                        "upDownAvailable": false
                    },
                    {
                        "name": "SEEKLEFT",
                        "shortPressAvailable": true,
                        "longPressAvailable": false,
                        "upDownAvailable": false
                    },
                    {
                        "name": "SEEKRIGHT",
                        "shortPressAvailable": true,
                        "longPressAvailable": false,
                        "upDownAvailable": false
                    }
                ]
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
    static PerformInteractionResponse(msgID, choiceID) {
        return ({
            "jsonrpc": "2.0",
            "id": msgID,
            "result": {
                "choiceID": choiceID,
                "code": 0,
                "method": "UI.PerformInteraction"
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
}

export default RpcFactory