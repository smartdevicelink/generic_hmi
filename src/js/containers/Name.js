import { connect } from 'react-redux'
import AppName from '../AppName'
import '../polyfill_find'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.appList.find((app) => {
        return app.appID === activeApp
    })

    var name = ""
    var showAlert = false

    for(var prop in state.ui) {
        if(state.ui[prop].alert.showAlert) {
            showAlert = true
        }
    }

    if(showAlert){
        name = "Alert"
    } else if(activeApp) {
        name = app.appName
    } else { 
        name = "Apps"
    }
    return {name: name}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Name = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppName)

export default Name