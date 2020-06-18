import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import AppName from '../AppName'
import '../polyfill_find'

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
        let submenu = state.ui[activeApp].menu.find(
            (entry) => {return entry.menuID && entry.menuID === state.ui[activeApp].activeSubMenu}
        )
        subMenuName = (submenu) ? submenu.menuName : "";
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