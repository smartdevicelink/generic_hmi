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
    
    if(state.ui[activeApp] && state.ui[activeApp].showStrings.templateTitle){
        templateTitle = state.ui[activeApp].showStrings.templateTitle;
    }
    if(state.ui[activeApp] && state.ui[activeApp].menu && state.ui[activeApp].activeSubMenu){
        var menu = state.ui[activeApp].menu;
        var activeSubMenu = state.ui[activeApp].activeSubMenu;
        var subMenu = SubmenuDeepFind(menu, activeSubMenu, 0).subMenu;
        subMenuName = (subMenu) ? subMenu.menuName : "";
    }

    if(activeApp && app) {
        name = app.appName ? app.appName : "Apps"
    } else { 
        name = "Apps"
    }
    return {name: name, templateTitle: templateTitle, subMenuName: subMenuName}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Name = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppName)

export default withRouter(Name)