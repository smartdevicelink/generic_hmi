import { connect } from 'react-redux'
import AppHeader from '../AppHeader'
import SubmenuDeepFind from '../Utils/SubMenuDeepFind'

const getAppByAppID = (list, appID) => {
    var app = list.find(key => {
        return key.appID === appID
    });
    return app;
}

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {
        isPerformingInteraction: false,
        isDisconnected: true,
        displayLayout: ""
    }

    var showAlert = false
    var showScrollableMessage = false;
    var showPerformAudioPassThru = false;
    var aptTextFields = [];
    var aptAppID = null;
    var aptMsgID = null;
    var aptAppName = "Microphone Listening";
    var scrollableMessageBody = "";
    var scrollableMessageAppName = "Scrollable Message";
    var scrollableMessageMsgId = null;
    var scrollableMessageAppId = null;
    var alertIsSubtle = false
    var alertMsgId = null
    var alertAppId = null
    var alertAppName = ""
    var alertShowProgressIndicator = false;
    var alertIcon = null
    var showSlider = false
    var sliderAppId = null
    var sliderAppName = ""
    var sliderData = {}
    for(const prop in state.ui){
        if(state.ui[prop].alert.showAlert){
            showAlert = true
            alertIsSubtle = state.ui[prop].alert.isSubtle
            alertMsgId = state.ui[prop].alert.msgID
            alertAppId = parseInt(prop)
            alertShowProgressIndicator = state.ui[prop].alert.showProgressIndicator;

            var alertApp = state.appList.find((key) => {
                return key.appID === parseInt(prop)
            })

            if(alertApp.appName) {
                alertAppName = alertApp.appName
            }

            if (state.ui[prop].alert.icon) {
                alertIcon = state.ui[prop].alert.icon
            }

            break
        }
        if (state.ui[prop].slider.showSlider) {
            showSlider = true

            sliderAppId = parseInt(prop)
            var sliderApp = state.appList.find((key) => {
                return key.appID === parseInt(prop)
            })

            if (sliderApp.appName) {
                sliderAppName = sliderApp.appName
            }

            sliderData = state.ui[prop].slider
            break;
        }
        if (state.ui[prop].scrollableMessage.active) {
            showScrollableMessage = true;
            scrollableMessageBody = state.ui[prop].scrollableMessage.body;
            scrollableMessageMsgId = state.ui[prop].scrollableMessage.msgID;
            scrollableMessageAppId = parseInt(prop);

            var scrollableMessageApp = state.appList.find((key) => {
                return key.appID === parseInt(prop);
            })

            if (scrollableMessageApp.appName) {
                scrollableMessageAppName = scrollableMessageApp.appName;
            }

            break;
        }
        if (state.ui[prop].audioPassThru.active) {
            showPerformAudioPassThru = true;
            aptTextFields = state.ui[prop].audioPassThru.textFields;
            aptAppID = parseInt(prop);
            aptMsgID = state.ui[prop].audioPassThru.msgID

            var aptApp = getAppByAppID(state.appList, aptAppID);

            if (aptApp.appName) {
                aptAppName = aptApp.appName;
            }

            break;
        }
    }

    var theme = state.theme
    var colorScheme = null;
    var triggerShowAppMenu = (state.ui[activeApp]) ? state.ui[activeApp].triggerShowAppMenu : false;
    var activeSubMenu = (state.ui[activeApp]) ? state.ui[activeApp].activeSubMenu : null;
    
    if (theme === true) { //Dark theme
        if(app.nightColorScheme) {
            if(app.nightColorScheme.backgroundColor) {
                colorScheme = app.nightColorScheme.backgroundColor
            }
        }
    } else {
        if(app.dayColorScheme) {
            if(app.dayColorScheme.backgroundColor) {
                colorScheme = app.dayColorScheme.backgroundColor
            }
        }
    }

    var subMenu = null;
    var parentID = null;
    if (app.activeSubMenu) {
        subMenu = SubmenuDeepFind(app.menu, app.activeSubMenu, 0);
    }

    if (subMenu) {
        parentID = subMenu.subMenu.parentID;
    }

    return {
        isPerformingInteraction: app.isPerformingInteraction,
        isDisconnected: app.isDisconnected,
        displayLayout: app.displayLayout,
        showScrollableMessage: showScrollableMessage,
        scrollableMessageBody: scrollableMessageBody,
        scrollableMessageAppName: scrollableMessageAppName,
        scrollableMessageMsgId: scrollableMessageMsgId,
        scrollableMessageAppId: scrollableMessageAppId,
        showAlert: showAlert,
        alertIsSubtle: alertIsSubtle,
        alertMsgId: alertMsgId,
        alertAppId: alertAppId,
        alertName: alertAppName,
        alertShowProgressIndicator: alertShowProgressIndicator,
        showSlider: showSlider,
        sliderAppId: sliderAppId,
        sliderName: sliderAppName,
        sliderData: sliderData,
        theme: theme,
        activeApp: activeApp,
        colorScheme: colorScheme,
        triggerShowAppMenu: triggerShowAppMenu,
        activeSubMenu: activeSubMenu,
        alertIcon: alertIcon,
        activeMenuDepth: app.activeMenuDepth,
        parentID: parentID,
        activeLayout: app.displayLayout,
        interactionLayout: app.interactionLayout,
        openPermissionsView: state.system.openPermissionsView,
        showPerformAudioPassThru: showPerformAudioPassThru,
        aptTextFields: aptTextFields,
        aptAppID: aptAppID,
        aptMsgID: aptMsgID,
        aptAppName: aptAppName
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Header = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeader)

export default Header
