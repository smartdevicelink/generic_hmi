export const Actions = {
    UPDATE_APP_LIST: "UPDATE_APP_LIST",
    ACTIVATE_APP: "ACTIVATE_APP",
    SHOW: "SHOW",
    SET_APP_ICON: "SET_APP_ICON",
    ADD_COMMAND: "ADD_COMMAND",
    ADD_SUB_MENU: "ADD_SUB_MENU",
    ACTIVATE_SUB_MENU: "ACTIVATE_SUB_MENU",
    DEACTIVATE_SUB_MENU: "DEACTIVATE_SUB_MENU"
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

export const addSubMenu = (appID, menuID, menuParams) => {
    return {
        type: Actions.ADD_SUB_MENU,
        appID: appID,
        menuID: menuID,
        menuParams: menuParams
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