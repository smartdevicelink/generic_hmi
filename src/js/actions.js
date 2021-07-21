export const Actions = {
    UPDATE_APP_LIST: "UPDATE_APP_LIST",
    ACTIVATE_APP: "ACTIVATE_APP",
    DEACTIVATE_APP: "DEACTIVATE_APP",
    SET_PENDING_APP_LAUNCH: "SET_PENDING_APP_LAUNCH",
    CLEAR_PENDING_APP_LAUNCH: "CLEAR_PENDING_APP_LAUNCH",
    SHOW: "SHOW",
    SET_APP_ICON: "SET_APP_ICON",
    ADD_COMMAND: "ADD_COMMAND",
    DELETE_COMMAND: "DELETE_COMMAND",
    ADD_SUB_MENU: "ADD_SUB_MENU",
    DELETE_SUB_MENU: "DELETE_SUB_MENU",
    SUBSCRIBE_BUTTON: "SUBSCRIBE_BUTTON",
    ACTIVATE_SUB_MENU: "ACTIVATE_SUB_MENU",
    DEACTIVATE_SUB_MENU: "DEACTIVATE_SUB_MENU",
    SHOW_APP_MENU: "SHOW_APP_MENU",
    RESET_SHOW_APP_MENU: "RESET_SHOW_APP_MENU",
    PERFORM_INTERACTION: "PERFORM_INTERACTION",
    DEACTIVATE_INTERACTION: "DEACTIVATE_INTERACTION",
    TIMEOUT_PERFORM_INTERACTION: "TIMEOUT_PERFORM_INTERACTION",
    SET_MEDIA_CLOCK_TIMER: "SET_MEDIA_CLOCK_TIMER",
    REGISTER_APPLICATION: "REGISTER_APPLICATION",
    UNREGISTER_APPLICATION: "UNREGISTER_APPLICATION",
    SET_TEMPLATE_CONFIGURATION: "SET_TEMPLATE_CONFIGURATION",
    SCROLLABLE_MESSAGE: "SCROLLABLE_MESSAGE",
    CLOSE_SCROLLABLE_MESSAGE: "CLOSE_SCROLLABLE_MESSAGE",
    PERFORM_AUDIO_PASSTHRU: "PERFORM_AUDIO_PASSTHRU",
    CLOSE_PERFORM_AUDIO_PASSTHRU: "CLOSE_PERFORM_AUDIO_PASSTHRU",
    ALERT: "ALERT",
    CLOSE_ALERT: "CLOSE_ALERT",
    SLIDER: "SLIDER",
    UPDATE_SLIDER_POSITION: "UPDATE_SLIDER_POSITION",
    CLOSE_SLIDER: "CLOSE_SLIDER",
    SET_THEME: "SET_THEME",
    POLICY_UPDATE: "POLICY_UPDATE",
    SET_URLS: "SET_URLS",
    SET_PTU_WITH_MODEM: "SET_PTU_WITH_MODEM",
    UPDATE_COLOR_SCHEME: "UPDATE_COLOR_SCHEME",
    SET_APP_IS_CONNECTED: "SET_APP_IS_CONNECTED",
    ON_SYSTEM_CAPABILITY_UPDATED: "ON_SYSTEM_CAPABILITY_UPDATED",
    ON_APP_SERVICE_DATA: "ON_APP_SERVICE_DATA",
    ON_PUT_FILE: "ON_PUT_FILE",
    SET_GLOBAL_PROPERTIES: "SET_GLOBAL_PROPERTIES",
    UPDATE_APPSTORE_CONNECTION_STATUS: "UPDATE_APPSTORE_CONNECTION_STATUS",
    UPDATE_AVAILABLE_APPSTORE_APPS: "UPDATE_AVAILABLE_APPSTORE_APPS",
    UPDATE_INSTALLED_APPSTORE_APPS: "UPDATE_INSTALLED_APPSTORE_APPS",
    ADD_APP_PENDING_SET_APP_PROPERTIES: "ADD_APP_PENDING_SET_APP_PROPERTIES",
    APPSTORE_APP_INSTALLED: "APPSTORE_APP_INSTALLED",
    APPSTORE_APP_UNINSTALLED: "APPSTORE_APP_UNINSTALLED",
    WEBENGINE_APP_LAUNCH: "WEBENGINE_APP_LAUNCH",
    WEBENGINE_APP_LAUNCH_FAILED: "WEBENGINE_APP_LAUNCH_FAILED",
    APPSTORE_BEGIN_INSTALL: "APPSTORE_BEGIN_INSTALL",
    WEB_VIEW_ACTIVE: "WEB_VIEW_ACTIVE",
    SET_DD_STATE: "SET_DD_STATE",
    SET_VIDEO_STREAM_URL: "SET_VIDEO_STREAM_URL",
    SET_VIDEO_STREAM_APP: "SET_VIDEO_STREAM_APP",
    NAVIGATION_VIEW_ACTIVE: "NAVIGATION_VIEW_ACTIVE",
    SET_VIDEO_STREAM_CAPABILITY: "SET_VIDEO_STREAM_CAPABILITY",
    SET_HAPTIC_DATA: "SET_HAPTIC_DATA",
    OPEN_PERMISSIONS_VIEW: "OPEN_PERMISSIONS_VIEW",
    RESET_OPEN_PERMISSIONS_VIEW: "RESET_OPEN_PERMISSIONS_VIEW",
    CLOSE_PERMISSIONS_VIEW: "CLOSE_PERMISSIONS_VIEW",
    CLEAR_APP_AWAITING_PERMISSIONS: "CLEAR_APP_AWAITING_PERMISSIONS"
}

export const updateAppList = (applications) => {
    return {
        type: Actions.UPDATE_APP_LIST,
        appList: applications
    }
}

export const activateApp = (appID) => {
    return {
        type: Actions.ACTIVATE_APP,
        activeApp: appID
    }
}

export const deactivateApp = (appID, reason) => {
    return {
        type: Actions.DEACTIVATE_APP,
        appID: appID,
        reason: reason
    }
}

export const show = (appID, showStrings, graphic, softButtons, secondaryGraphic) => {
    return {
        type: Actions.SHOW,
        appID: appID,
        showStrings: showStrings,
        graphic: graphic,
        softButtons: softButtons,
        secondaryGraphic: secondaryGraphic
    }
}

export const setAppIcon = (appID, icon) => {
    return {
        type: Actions.SET_APP_ICON,
        appID: appID,
        icon: icon
    }
}

export const addCommand = (appID, cmdID, menuParams, cmdIcon, secondaryImage) => {
    return {
        type: Actions.ADD_COMMAND,
        appID: appID,
        cmdID: cmdID,
        menuParams: menuParams,
        cmdIcon: cmdIcon,
        secondaryImage: secondaryImage
    }
}

export const deleteCommand = (appID, cmdID) => {
    return {
        type: Actions.DELETE_COMMAND,
        appID: appID,
        cmdID: cmdID
    }
}

export const addSubMenu = (appID, menuID, menuParams, icon, menuLayout, secondaryImage) => {
    return {
        type: Actions.ADD_SUB_MENU,
        appID: appID,
        menuID: menuID,
        menuParams: menuParams,
        subMenuIcon: icon,
        menuLayout: menuLayout,
        secondaryImage: secondaryImage
    }
}

export const deleteSubMenu = (appID, menuID) => {
    return {
        type: Actions.DELETE_SUB_MENU,
        appID: appID,
        menuID: menuID
    }
}

export const subscribeButton = (appID, buttonName, isSubscribed) => {
    return {
        type: Actions.SUBSCRIBE_BUTTON,
        appID,
        buttonName,
        isSubscribed
    }
}

export const activateSubMenu = (appID, menuID, depth) => {
    return {
        type: Actions.ACTIVATE_SUB_MENU,
        menuID: menuID,
        appID: appID,
        depth: depth
    }
}

export const deactivateSubMenu = (appID) => {
    return {
        type: Actions.DEACTIVATE_SUB_MENU,
        appID: appID
    }
}

export const showAppMenu = (appID, menuID) => {
    return {
        type: Actions.SHOW_APP_MENU,
        menuID: menuID,
        appID: appID
    }
}

export const resetShowAppMenu = (appID) => {
    return {
        type: Actions.RESET_SHOW_APP_MENU,
        appID: appID
    }
}

export const setPendingAppLaunch = (appID) => {
    return {
        type: Actions.SET_PENDING_APP_LAUNCH,
        appID: appID
    }
}

export const clearPendingAppLaunch = (appID) => {
    return {
        type: Actions.CLEAR_PENDING_APP_LAUNCH
    }
}

export const deactivateInteraction = (appID) => {
    return {
        type: Actions.DEACTIVATE_INTERACTION,
        appID: appID
    }
}

export const performInteraction = (appID, text, choices, layout, msgID, cancelID, timeout) => {
    return {
        type: Actions.PERFORM_INTERACTION,
        appID: appID,
        text: text,
        choices: choices,
        layout: layout,
        msgID: msgID,
        cancelID: cancelID,
        timeout: timeout
    }
}

export const timeoutPerformInteraction = (msgID, appID) => {
    return {
        type: Actions.TIMEOUT_PERFORM_INTERACTION,
        msgID: msgID,
        appID: appID
    }
}

export const setMediaClockTimer = (appID, startTime, endTime, updateMode, audioStreamingIndicator, forwardSeekIndicator, backSeekIndicator, countRate) => {
    return {
        type: Actions.SET_MEDIA_CLOCK_TIMER,
        appID: appID,
        startTime: startTime,
        endTime: endTime,
        updateMode: updateMode,
        audioStreamingIndicator: audioStreamingIndicator,
        forwardSeekIndicator: forwardSeekIndicator,
        backSeekIndicator: backSeekIndicator,
        countRate: countRate
    }
}

export const setTemplateConfiguration = (displayLayout, appID, dayColorScheme, nightColorScheme) => {
    return {
        type: Actions.SET_TEMPLATE_CONFIGURATION,
        displayLayout: displayLayout,
        appID: appID,
        dayColorScheme: dayColorScheme,
        nightColorScheme: nightColorScheme
    }
}

export const registerApplication = (appID, displayLayout) => {
  return {
      type: Actions.REGISTER_APPLICATION,
      appID: appID,
      displayLayout: displayLayout
  }
}

export const unregisterApplication = (appID, isUnexpected) => {
    return {
        type: Actions.UNREGISTER_APPLICATION,
        appID: appID,
        isUnexpected: isUnexpected
    }
}

export const scrollableMessage = (appID, msgID, messageBody, softButtons, duration, cancelID) => {
    return {
        type: Actions.SCROLLABLE_MESSAGE,
        appID: appID,
        msgID: msgID,
        messageBody: messageBody,
        softButtons: softButtons,
        duration: duration,
        cancelID: cancelID
    }
}

export const closeScrollableMessage = (msgID, appID) => {
    return {
        type: Actions.CLOSE_SCROLLABLE_MESSAGE,
        appID: appID,
        msgID: msgID
    }
}

export const performAudioPassThru = (appID, textFields, duration, msgID) => {
    return {
        type: Actions.PERFORM_AUDIO_PASSTHRU,
        appID: appID,
        aptTextFields: textFields,
        duration: duration,
        msgID: msgID
    }
}

export const closePerformAudioPassThru = (msgID, appID) => {
    return {
        type: Actions.CLOSE_PERFORM_AUDIO_PASSTHRU,
        appID: appID,
        msgID: msgID
    }
}

export const alert = (appID, alertStrings, duration, softButtons, alertType, progressIndicator, msgID, icon, cancelID, isSubtle=false) => {
    return {
        type: Actions.ALERT,
        appID: appID,
        alertStrings: alertStrings,
        duration: duration,
        softButtons: softButtons,
        alertType: alertType,
        showProgressIndicator: progressIndicator,
        msgID: msgID,
        icon: icon,
        cancelID: cancelID,
        isSubtle: isSubtle
    }
}

export const closeAlert = (msgID, appID) => {
    return {
        type: Actions.CLOSE_ALERT,
        msgID: msgID,
        appID: appID
    }
}

export const slider = (appID, numTicks, position, sliderHeader, sliderFooter, timeout, msgID, cancelID) => {
    return {
        type: Actions.SLIDER,
        appID: appID,
        numTicks: numTicks,
        position: position,
        sliderHeader: sliderHeader,
        sliderFooter: sliderFooter,
        timeout: timeout,
        msgID: msgID,
        cancelID: cancelID
    }
}

export const updateSliderPosition = (appID, newPosition) =>{
    return {
        type: Actions.UPDATE_SLIDER_POSITION,
        appID: appID,
        newPosition: newPosition
    }
}

export const closeSlider = (msgID, appID) => {
    return {
        type: Actions.CLOSE_SLIDER,
        msgID: msgID,
        appID: appID
    }
}

export const setTheme = (theme) => {
    return {
        type: Actions.SET_THEME,
        theme: theme
    }
}

export const policyUpdate = (file, retry, timeout) => {
    return {
        type: Actions.POLICY_UPDATE,
        file: file,
        retry: retry,
        timeout: timeout
    }
}

export const setURLS = (urls) => {
    return {
        type: Actions.SET_URLS,
        urls: urls
    }
}

export const setPTUWithModem = (enabled) => {
    return {
        type: Actions.SET_PTU_WITH_MODEM,
        enabled: enabled
    }
}

export const updateColorScheme = (appID, dayColorScheme, nightColorScheme) => {
    return {
        type: Actions.UPDATE_COLOR_SCHEME,
        dayColorScheme: dayColorScheme,
        nightColorScheme: nightColorScheme,
        appID: appID
    }
}

export const setAppIsConnected = (appID) => {
    return {
        type: Actions.SET_APP_IS_CONNECTED, 
        appID: appID
    }
}

export const onSystemCapabilityUpdated = (capability) => {
    return {
        type: Actions.ON_SYSTEM_CAPABILITY_UPDATED,
        capability: capability
    }
}

export const onAppServiceData = (service_data) => {
    return {
        type: Actions.ON_APP_SERVICE_DATA,
        serviceData: service_data
    }
}

export const onPutFile = (appID, fileName, fileType, fileSize, offset, length, isSystemFile, isPersistentFile) => {
    return {
        type: Actions.ON_PUT_FILE,
        appID: appID,
        fileName: fileName,
        fileType: fileType,
        fileSize: fileSize,
        offset: offset,
        length: length,
        isSystemFile: isSystemFile,
        isPersistentFile: isPersistentFile
    }
}

export const setGlobalProperties = (appID, menuLayout, menuIcon, keyboardProperties) => {
    return {
        type: Actions.SET_GLOBAL_PROPERTIES,
        appID: appID,
        menuLayout: menuLayout,
        menuIcon: menuIcon,
        keyboardProperties: keyboardProperties
    }
}

export const updateAppStoreConnectionStatus = (isConnected) => {
    return {
        type: Actions.UPDATE_APPSTORE_CONNECTION_STATUS,
        isConnected: isConnected 
    }
}

export const updateAvailableAppStoreApps = (availableApps) => {
    return {
        type: Actions.UPDATE_AVAILABLE_APPSTORE_APPS,
        availableApps: availableApps
    };
}

export const updateInstalledAppStoreApps = (installedApp) => {
    return {
        type: Actions.UPDATE_INSTALLED_APPSTORE_APPS,
        installedApp: installedApp
    };
}

export const addAppPendingSetAppProperties = (app, enable) => {
    return {
        type: Actions.ADD_APP_PENDING_SET_APP_PROPERTIES,
        app: app,
        enable: enable
    }
}

export const appStoreAppInstalled = (success) => {
    return {
        type: Actions.APPSTORE_APP_INSTALLED,
        success: success
    }
}

export const appStoreAppUninstalled = (success) => {
    return {
        type: Actions.APPSTORE_APP_UNINSTALLED,
        success: success
    }
}

export const webEngineAppLaunch = (policyAppID, appID) => {
    return {
        type: Actions.WEBENGINE_APP_LAUNCH,
        policyAppID: policyAppID,
        appID: appID
    }
}

export const webEngineAppLaunchFailed = (appID) => {
    return {
        type: Actions.WEBENGINE_APP_LAUNCH_FAILED,
        appID: appID
    }
}


export const appStoreBeginInstall = (policyAppID) => {
    return {
        type: Actions.APPSTORE_BEGIN_INSTALL,
        policyAppID: policyAppID
    }
}

export const appStoreWebViewActive = () => {
    return {
        type: Actions.WEB_VIEW_ACTIVE,
        active: true
    }
}

export const appStoreWebViewInactive = () => {
    return {
        type: Actions.WEB_VIEW_ACTIVE,
        active: false
    }
}

export const setDDState = (ddState) => {
    return {
        type: Actions.SET_DD_STATE,
        dd: ddState
    }
}

export const setVideoStreamUrl = (url) => {
    return {
        type: Actions.SET_VIDEO_STREAM_URL,
        url: url
    }
}

export const setVideoStreamingApp = (appID) => {
    return {
        type: Actions.SET_VIDEO_STREAM_APP,
        appID: appID
    }
}

export const systemNavigationViewActive = () => {
    return {
        type: Actions.NAVIGATION_VIEW_ACTIVE,
        active: true
    }
}

export const systemNavigationViewInactive = () => {
    return {
        type: Actions.NAVIGATION_VIEW_ACTIVE,
        active: false
    }
}

export const setVideoStreamingCapability = (appID, capability) => {
    return {
        type: Actions.SET_VIDEO_STREAM_CAPABILITY,
        appID: appID,
        capability: capability
    }
}

export const setHapticData = (appID, hapticRects) => ({
    type: Actions.SET_HAPTIC_DATA,
    appID: appID,
    hapticRects: hapticRects
});

export const openPermissionsView = (appID, allowedFunctions, permissionsAppAwaitingActivation=false) => ({
    type: Actions.OPEN_PERMISSIONS_VIEW,
    appID: appID,
    allowedFunctions: allowedFunctions,
    permissionsAppAwaitingActivation: permissionsAppAwaitingActivation ? appID : false
});

export const resetOpenPermissionsView = () => ({
    type: Actions.RESET_OPEN_PERMISSIONS_VIEW
});

export const closePermissionsView = () => ({
    type: Actions.CLOSE_PERMISSIONS_VIEW
});

export const clearAppAwaitingPermissions = () => ({
    type: Actions.CLEAR_APP_AWAITING_PERMISSIONS
});
