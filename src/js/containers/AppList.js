import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import bcController from '../Controllers/BCController'

const mapStateToProps = (state) => {
    console.log(state)
    var data = state.appList.map ((app, index) => {
        console.log(app.icon.value)
        return {
            id: app.appID,
            class: 'with-image',
            name: app.appName,
            image: app.icon.value,
            link: '/media'
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const AppList = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default AppList