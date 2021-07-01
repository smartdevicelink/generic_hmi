import store from "../store";
import uiController from "../Controllers/UIController";

import SubmenuDeepFind from "./SubMenuDeepFind";

// Helper function to determine if menu has any children that need to be updated
export default function CheckForSubmenuNeedUpdate(appID, menuID) {
    var state = store.getState();
    var app = state.ui[appID];

    var commands = 0 === menuID ? app.menu :
        SubmenuDeepFind(app.menu, menuID, 0).subMenu.subMenu;

    commands.forEach((command) => {
        if (command.subMenu && command.subMenu.length === 0) {
            uiController.onUpdateSubMenu(appID, command.menuID);
        }
    });
}