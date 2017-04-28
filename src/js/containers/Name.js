import { connect } from 'react-redux'
import AppName from '../AppName'
import '../polyfill_find'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.appList.find((app) => {
        console.log("applist find")
        console.log(app.appID)
        console.log(activeApp)
        return app.appID === activeApp
    })

    var name = ""

    if(activeApp) {
        console.log("NAME")
        console.log(app)
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