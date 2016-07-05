export const Actions = {
    UPDATE_APP_LIST: "UPDATE_APP_LIST",
    ACTIVATE_APP: "ACTIVATE_APP",
    SHOW: "SHOW",
    SET_APP_ICON: "SET_APP_ICON",
    ADD_COMMAND: "ADD_COMMAND"
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