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
    PERFORM_INTERACTION: "PERFORM_INTERACTION",
    DEACTIVATE_INTERACTION: "DEACTIVATE_INTERACTION",
    TIMEOUT_PERFORM_INTERACTION: "TIMEOUT_PERFORM_INTERACTION",
    SET_MEDIA_CLOCK_TIMER: "SET_MEDIA_CLOCK_TIMER",
    UNREGISTER_APPLICATION: "UNREGISTER_APPLICATION"
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
        type: Actions.DEACTIVATE_APP
    }
}

export const show = (appID, showStrings, graphic, softButtons) => {
    return {
        type: Actions.SHOW,
        appID: appID,
        showStrings: showStrings,
        graphic: graphic,
        softButtons: softButtons
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

export const addSubMenu = (appID, menuID, menuParams) => {
    return {
        type: Actions.ADD_SUB_MENU,
        appID: appID,
        menuID: menuID,
        menuParams: menuParams
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

export const deactivateInteraction = (appID) => {
    return {
        type: Actions.DEACTIVATE_INTERACTION,
        appID: appID
    }
}

export const performInteraction = (appID, text, choices, layout, msgID) => {
    return {
        type: Actions.PERFORM_INTERACTION,
        appID: appID,
        text: text,
        choices: choices,
        layout: layout,
        msgID: msgID
    }
}

export const timeoutPerformInteraction = (msgID, appID) => {
    return {
        type: Actions.TIMEOUT_PERFORM_INTERACTION,
        msgID: msgID,
        appID: appID
    }
}

export const setMediaClockTimer = (appID, startTime, endTime, updateMode) => {
    return {
        type: Actions.SET_MEDIA_CLOCK_TIMER,
        appID: appID,
        startTime: startTime,
        endTime: endTime,
        updateMode: updateMode
    }
}

export const unregisterApplication = (appID, isUnexpected) => {
    return {
        type: Actions.UNREGISTER_APPLICATION,
        appID: appID,
        isUnexpected: isUnexpected
    }
}