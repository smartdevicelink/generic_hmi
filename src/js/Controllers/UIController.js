import RpcFactory from './RpcFactory'
import {
    show,
    setAppIcon, 
    addCommand, 
    addSubMenu, 
    deleteCommand, 
    deleteSubMenu, 
    subscribeButton, 
    performInteraction,
    timeoutPerformInteraction,
    setMediaClockTimer,
    setDisplayLayout,
    alert,
    closeAlert,
    activateApp
} from '../actions'
import store from '../store'

class UIController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.failInteractions = this.failInteractions.bind(this)
        this.onPerformInteractionTimeout = this.onPerformInteractionTimeout.bind(this)
        this.onAlertTimeout = this.onAlertTimeout.bind(this)
        this.onDefaultAction = this.onDefaultAction.bind(this)
        this.onKeepContext = this.onKeepContext.bind(this)
        this.onStealFocus = this.onStealFocus.bind(this)
        this.timers = {}
        this.appsWithTimers = {}
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, true)}
            case "Show":
                store.dispatch(show(
                    rpc.params.appID,
                    rpc.params.showStrings,
                    rpc.params.graphic,
                    rpc.params.softButtons
                ))
                return true
            case "SetAppIcon":
                store.dispatch(setAppIcon(rpc.params.appID, rpc.params.syncFileName))
                return true
            case "ChangeRegistration":
                return true
            case "AddCommand":
                store.dispatch(addCommand(
                    rpc.params.appID,
                    rpc.params.cmdID,
                    rpc.params.menuParams,
                    rpc.params.cmdIcon
                ))
                return true
            case "AddSubMenu":
                store.dispatch(addSubMenu(
                    rpc.params.appID,
                    rpc.params.menuID,
                    rpc.params.menuParams
                ))
                return true
            case "DeleteCommand":
                store.dispatch(deleteCommand(
                    rpc.params.appID,
                    rpc.params.cmdID
                ))
                return true
            case "DeleteSubMenu":
                store.dispatch(deleteSubMenu(
                    rpc.params.appID,
                    rpc.params.menuID
                ))
                return true
            case "OnButtonSubscription":
                store.dispatch(subscribeButton(
                    rpc.params.appID,
                    rpc.params.name,
                    rpc.params.isSubscribed
                ))
                return null
            case "PerformInteraction":
                store.dispatch(performInteraction(
                    rpc.params.appID,
                    rpc.params.initialText,
                    rpc.params.choiceSet,
                    rpc.params.interactionLayout,
                    rpc.id
                ))
                var timeout = rpc.params.timeout === 0 ? 15000 : rpc.params.timeout
                this.timers[rpc.id] = setTimeout(this.onPerformInteractionTimeout, timeout, rpc.id, rpc.params.appID)
                this.appsWithTimers[rpc.id] = rpc.params.appID
                break
            case "SetMediaClockTimer":
                store.dispatch(setMediaClockTimer(
                    rpc.params.appID,
                    rpc.params.startTime,
                    rpc.params.endTime,
                    rpc.params.updateMode
                ))
                return true
            case "SetDisplayLayout":
                store.dispatch(setDisplayLayout(rpc.params.displayLayout, rpc.params.appID));
                return true;
            case "SetGlobalProperties":
                // TODO: implement this RPC
                return true
            case "Alert":
                store.dispatch(alert(
                    rpc.params.appID,
                    rpc.params.alertStrings,
                    rpc.params.duration,
                    rpc.params.softButtons,
                    rpc.params.alertType,
                    rpc.params.progressIndicator,
                    rpc.id
                ))
                var timeout = rpc.params.duration ? rpc.params.duration : 10000
                this.timers[rpc.id] = setTimeout(this.onAlertTimeout, timeout, rpc.id, rpc.params.appID)
                this.appsWithTimers[rpc.id] = rpc.params.appID

                this.onSystemContext("ALERT", rpc.params.appID)

                return null
        }
    }
    onPerformInteractionTimeout(msgID, appID) {
        delete this.timers[msgID]
        this.listener.send(RpcFactory.PerformInteractionFailure(msgID))
        store.dispatch(timeoutPerformInteraction(
            msgID,
            appID
        ))
    }
    onAlertTimeout(msgID, appID, context) {
        delete this.timers[msgID]
        store.dispatch(closeAlert(
            msgID,
            appID
        ))
        this.listener.send(RpcFactory.AlertResponse(msgID, appID))
        this.onSystemContext("MAIN", context)
    }
    onStealFocus(alert, context) {        
        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        store.dispatch(closeAlert(
            alert.msgID,
            alert.appID
        ))        
        this.listener.send(RpcFactory.AlertResponse(alert.msgID, alert.appID))
        //TODO: Need to add logic to switch app screens      
        // Rework active app
        //send systemcontext for last appid and new app id  
        if(context){
            this.onSystemContext("MAIN", context)
        } else {
            this.onSystemContext("MENU")//Viewing App List
        }
        store.dispatch(activateApp(alert.appID))
        this.onSystemContext("MAIN", alert.appID)
    }
    onKeepContext(alert) {
        clearTimeout(this.timers[alert.msgID])
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        var timeout = alert.duration ? alert.duration : 10000
        this.timers[alert.msgID] = setTimeout(this.onAlertTimeout, timeout, alert.msgID, alert.appID)
        this.onResetTimeout(alert.appID, "UI.Alert")   

    }
    onDefaultAction(alert, context) {
        clearTimeout(this.timers[alert.msgID])
        delete this.timers[alert.msgID]
        this.onButtonPress(alert.appID, alert.buttonID, alert.buttonName)
        store.dispatch(closeAlert(
            alert.msgID,
            alert.appID
        ))
        this.listener.send(RpcFactory.AlertResponse(alert.msgID, alert.appID))
        if(context){
            this.onSystemContext("MAIN", context)
        } else {
            this.onSystemContext("MENU")//Viewing App List
        }
    }
    onChoiceSelection(choiceID, appID, msgID) {
        clearTimeout(this.timers[msgID])
        delete this.timers[msgID]
        this.listener.send(RpcFactory.PerformInteractionResponse(choiceID, appID, msgID))
    }
    onSystemContext(context, appID) {
        this.listener.send(RpcFactory.OnSystemContextNotification(context, appID))
    }
    onCommand(cmdID, appID) {
        this.listener.send(RpcFactory.OnCommandNotification(cmdID, appID))
    }
    onButtonPress(appID, buttonID, buttonName) {
        var button = {
            name: buttonName,
            mode: "BUTTONDOWN",
            customButtonID: buttonID
        }
        this.listener.send(RpcFactory.OnButtonEventNotification(appID, button))
        button.mode = "BUTTONUP"
        this.listener.send(RpcFactory.OnButtonEventNotification(appID, button))
        button.mode = "SHORT"
        this.listener.send(RpcFactory.OnButtonPressNotification(appID, button))
    }
    failInteractions() {
        for (var msgID in this.timers) {
            clearTimeout(this.timers[msgID])
            delete this.timers[msgID]
            this.listener.send(RpcFactory.PerformInteractionFailure(parseInt(msgID)))
            store.dispatch(timeoutPerformInteraction(
                parseInt(msgID),
                this.appsWithTimers[msgID]
            ))
        }
    }
    onResetTimeout(appID, methodName) {
        this.listener.send(RpcFactory.OnResetTimeout(appID, methodName))
    }
}

let controller = new UIController ()
export default controller