export const Actions = {
    UPDATE_APP_LIST: "UPDATE_APP_LIST",
    ACTIVATE_APP: "ACTIVATE_APP",
    DEACTIVATE_APP: "DEACTIVATE_APP",
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
    ALERT: "ALERT",
    CLOSE_ALERT: "CLOSE_ALERT",
    SET_THEME: "SET_THEME",
    POLICY_UPDATE: "POLICY_UPDATE",
    SET_URLS: "SET_URLS",
    UPDATE_COLOR_SCHEME: "UPDATE_COLOR_SCHEME",
    SET_APP_IS_CONNECTED: "SET_APP_IS_CONNECTED",
    ON_SYSTEM_CAPABILITY_UPDATED: "ON_SYSTEM_CAPABILITY_UPDATED",
    ON_APP_SERVICE_DATA: "ON_APP_SERVICE_DATA",
    ON_PUT_FILE: "ON_PUT_FILE",
    SET_GLOBAL_PROPERTIES: "SET_GLOBAL_PROPERTIES"
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

export const deactivateApp = (appID) => {
    return {
        type: Actions.DEACTIVATE_APP,
        appID: appID
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

export const addCommand = (appID, cmdID, menuParams, cmdIcon) => {
    return {
        type: Actions.ADD_COMMAND,
        appID: appID,
        cmdID: cmdID,
        menuParams: menuParams,
        cmdIcon: cmdIcon
    }
}

export const deleteCommand = (appID, cmdID) => {
    return {
        type: Actions.DELETE_COMMAND,
        appID: appID,
        cmdID: cmdID
    }
}

export const addSubMenu = (appID, menuID, menuParams, icon, menuLayout) => {
    return {
        type: Actions.ADD_SUB_MENU,
        appID: appID,
        menuID: menuID,
        menuParams: menuParams,
        subMenuIcon: icon,
        menuLayout: menuLayout
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
        appID: appID,
        buttonName: buttonName,
        isSubscribed: isSubscribed
    }
}

export const activateSubMenu = (appID, menuID) => {
    return {
        type: Actions.ACTIVATE_SUB_MENU,
        menuID: menuID,
        appID: appID
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

export const deactivateInteraction = (appID) => {
    return {
        type: Actions.DEACTIVATE_INTERACTION,
        appID: appID
    }
}

export const performInteraction = (appID, text, choices, layout, msgID, cancelID) => {
    return {
        type: Actions.PERFORM_INTERACTION,
        appID: appID,
        text: text,
        choices: choices,
        layout: layout,
        msgID: msgID,
        cancelID: cancelID
    }
}

export const timeoutPerformInteraction = (msgID, appID) => {
    return {
        type: Actions.TIMEOUT_PERFORM_INTERACTION,
        msgID: msgID,
        appID: appID
    }
}

export const setMediaClockTimer = (appID, startTime, endTime, updateMode, audioStreamingIndicator) => {
    return {
        type: Actions.SET_MEDIA_CLOCK_TIMER,
        appID: appID,
        startTime: startTime,
        endTime: endTime,
        updateMode: updateMode,
        audioStreamingIndicator: audioStreamingIndicator
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

export const registerApplication = (appID, isMediaApplication) => {
  return {
      type: Actions.REGISTER_APPLICATION,
      appID: appID,
      isMediaApplication: isMediaApplication
  }
}

export const unregisterApplication = (appID, isUnexpected) => {
    return {
        type: Actions.UNREGISTER_APPLICATION,
        appID: appID,
        isUnexpected: isUnexpected
    }
}

export const alert = (appID, alertStrings, duration, softButtons, alertType, progressIndicator, msgID, icon, cancelID) => {
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
        cancelID: cancelID
    }
}

export const closeAlert = (msgID, appID) => {
    return {
        type: Actions.CLOSE_ALERT,
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

export const setGlobalProperties = (appID, menuLayout) => {
    return {
        type: Actions.SET_GLOBAL_PROPERTIES,
        appID: appID,
        menuLayout: menuLayout
    }
}