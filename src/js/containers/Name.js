import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import AppName from '../AppName'
import '../polyfill_find'
import SubmenuDeepFind from '../Utils/SubMenuDeepFind'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.appList.find((app) => {
        return app.appID === activeApp
    })

    var name = ""
    var templateTitle = "";
    var subMenuName = "";
    var interactionText = "";
    
    if(state.ui[activeApp] && state.ui[activeApp].showStrings.templateTitle){
        templateTitle = state.ui[activeApp].showStrings.templateTitle;
    }
    if(state.ui[activeApp] && state.ui[activeApp].menu && state.ui[activeApp].activeSubMenu){
        var menu = state.ui[activeApp].menu;
        var activeSubMenu = state.ui[activeApp].activeSubMenu;
        var subMenu = SubmenuDeepFind(menu, activeSubMenu, 0).subMenu;
        subMenuName = (subMenu) ? subMenu.menuName : "";
    }
    if(state.ui[activeApp] && state.ui[activeApp].isPerformingInteraction 
        && state.ui[activeApp].interactionText?.fieldText) {
        interactionText = state.ui[activeApp].interactionText.fieldText;
    }

    if(activeApp && app) {
        name = app.appName ? app.appName : "Apps"
    } else if (state.system.editingPermissionsAppId) {
        var permissionsApp = state.appList.find((app) => {
            return app.appID === state.system.editingPermissionsAppId
        });

        name = permissionsApp ? permissionsApp.appName : 'App' + ' Permissions';
    } else { 
        name = "Apps"
    }
    return {name: name, templateTitle: templateTitle, subMenuName: subMenuName, interactionText: interactionText}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Name = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppName)

export default withRouter(Name)