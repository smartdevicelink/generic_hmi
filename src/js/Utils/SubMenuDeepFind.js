// Depth First Search Recursive Function
export default function SubmenuDeepFind (menu, parentID, depth) { 
    if (!menu || !parentID) {
        return null;
    }
    var deepSubMenu = null;
    var subMenu = menu.find((command) => {
        if (command.subMenu) { 
            var result = SubmenuDeepFind(command.subMenu, parentID, depth + 1)
            if (result && result.subMenu) {
                deepSubMenu = result;
                return true;
            }
        }
        return command.menuID === parentID
    });

    if (deepSubMenu) {
        return deepSubMenu;
    }
    
    if (subMenu) {
        return {
            subMenu: subMenu,
            depth: depth
        }
    }

    return null;
}