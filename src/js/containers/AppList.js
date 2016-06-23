import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import { activateApp } from '../actions'

const mapStateToProps = (state) => {
    console.log(state)
    var data = state.appList.map ((app, index) => {
        return {
            id: index,
            class: 'with-image',
            name: app.appName,
            image: '/src/img/app-spotify.png',
            link: '/media'
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        activate: (appID) => {
            dispatch(activateApp(appID))
        }
    }
}

const AppList = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default AppList